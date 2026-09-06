import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { TokenService } from './token.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, Role } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  // ─── Register & Verify ───────────────────────────────────────────────────
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      // If unverified, we could resend token. If active, conflict.
      if (existing.status === 'ACTIVE') throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const initials = dto.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    let user = existing;
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          password: hashedPassword,
          phone: dto.phone,
          initials,
          role: (dto.role as Role) ?? Role.CUSTOMER,
          status: 'SUSPENDED', // Requires verification to become ACTIVE
        },
      });
    }

    const verifyToken = await this.tokenService.createVerificationToken(user.id);
    
    // Mock Email sending
    this.logger.log(`[EMAIL MOCK] To: ${user.email} - Please verify your email with token: ${verifyToken}`);

    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const userId = await this.tokenService.verifyEmailToken(token);
    if (!userId) throw new BadRequestException('Invalid or expired verification token');

    await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });

    return { message: 'Email verified successfully. You may now log in.' };
  }

  // ─── Login & Session ──────────────────────────────────────────────────────
  async login(dto: LoginDto, ip: string, userAgent: string): Promise<AuthTokens & { user: Partial<User> }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.password) {
      throw new UnauthorizedException('This account signs in with Google. Please use "Continue with Google".');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.status === 'SUSPENDED') throw new UnauthorizedException('Account suspended or not verified');

    const sessionId = await this.tokenService.createSession(user.id, ip, userAgent);
    const tokens = await this.generateTokens(user, sessionId);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { password: _pw, refreshToken: _rt, googleId: _gid, ...safeUser } = user;
    return { ...tokens, user: safeUser, sessionId };
  }

  async googleLogin(
    reqUser: { googleId: string; email?: string; emailVerified?: boolean; firstName?: string; lastName?: string; picture?: string },
    ip: string,
    userAgent: string,
  ): Promise<AuthTokens & { user: Partial<User> }> {
    if (!reqUser?.email) throw new BadRequestException('No email provided by Google');
    if (reqUser.emailVerified === false) {
      throw new UnauthorizedException('Your Google account email is not verified.');
    }

    // 1) Identity already linked — this is a returning Google user.
    let user = await this.prisma.user.findUnique({ where: { googleId: reqUser.googleId } });

    if (!user) {
      // 2) No linked identity yet — check whether an account already exists for this email.
      const existingByEmail = await this.prisma.user.findUnique({ where: { email: reqUser.email } });

      if (existingByEmail) {
        // Case C: existing email/password (or invited) account with a matching, Google-verified
        // email. Link the Google identity to it rather than creating a duplicate account.
        // Google has independently verified ownership of this email, so an account that was only
        // pending email verification can now be safely activated.
        user = await this.prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            googleId: reqUser.googleId,
            avatarUrl: existingByEmail.avatarUrl ?? reqUser.picture,
            status: existingByEmail.status === 'SUSPENDED' ? 'ACTIVE' : existingByEmail.status,
          },
        });
      } else {
        // Case A: brand new user — no password, since this account only authenticates via Google.
        const initials = ((reqUser.firstName?.[0] || '') + (reqUser.lastName?.[0] || '')).toUpperCase();
        user = await this.prisma.user.create({
          data: {
            email: reqUser.email,
            fullName: `${reqUser.firstName ?? ''} ${reqUser.lastName ?? ''}`.trim() || 'Google User',
            password: null,
            googleId: reqUser.googleId,
            initials: initials || 'GU',
            avatarUrl: reqUser.picture,
            status: 'ACTIVE',
          },
        });
      }
    }
    // else: Case B — identity already linked, just log in.

    if (user.status === 'SUSPENDED') throw new UnauthorizedException('Account suspended');

    const sessionId = await this.tokenService.createSession(user.id, ip, userAgent);
    const tokens = await this.generateTokens(user, sessionId);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { password: _pw, refreshToken: _rt, googleId: _gid, ...safeUser } = user;
    return { ...tokens, user: safeUser, sessionId };
  }

  // ─── Refresh ──────────────────────────────────────────────────────────────
  async refreshTokens(userId: string, incomingToken: string, sessionId?: string): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshToken) throw new UnauthorizedException('Access denied');

    const tokenMatch = await bcrypt.compare(incomingToken, user.refreshToken);
    if (!tokenMatch) throw new UnauthorizedException('Access denied');

    if (sessionId) {
      await this.tokenService.updateSessionActivity(userId, sessionId);
    }

    const tokens = await this.generateTokens(user, sessionId);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  async logout(userId: string, sessionId?: string): Promise<void> {
    if (sessionId) {
      await this.tokenService.revokeSession(userId, sessionId);
    }
    // Note: We don't nullify user.refreshToken unless we revoke ALL sessions,
    // because multiple devices might be logged in. 
  }

  // ─── Password Reset ───────────────────────────────────────────────────────
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      const resetToken = await this.tokenService.createResetToken(user.id);
      this.logger.log(`[EMAIL MOCK] To: ${user.email} - Password reset token: ${resetToken}`);
    }
    // Always return success to prevent email enumeration
    return { message: 'If that email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const userId = await this.tokenService.verifyResetToken(token);
    if (!userId) throw new BadRequestException('Invalid or expired reset token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, refreshToken: null }, // Invalidate all sessions
    });

    await this.tokenService.revokeAllSessions(userId);

    return { message: 'Password has been reset successfully' };
  }

  // ─── Profile & Sessions ───────────────────────────────────────────────────
  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const { password: _pw, refreshToken: _rt, googleId: _gid, ...safeUser } = user;
    return safeUser;
  }

  async getSessions(userId: string) {
    return this.tokenService.getActiveSessions(userId);
  }

  async revokeSession(userId: string, sessionId: string) {
    return this.tokenService.revokeSession(userId, sessionId);
  }

  // ─── OAuth Exchange Codes ─────────────────────────────────────────────────
  // The Google callback runs on a top-level browser redirect from accounts.google.com,
  // so it can't return JSON directly to the SPA. Instead it stores the finished login
  // result under a one-time code and redirects to the frontend with just that code;
  // the frontend immediately exchanges it for the real tokens over a normal POST.
  // This avoids ever putting JWTs in a URL (browser history, server logs, Referer headers).
  async createOAuthExchangeCode(payload: AuthTokens & { user: Partial<User> }): Promise<string> {
    return this.tokenService.createExchangeCode(payload as unknown as Record<string, unknown>);
  }

  async consumeOAuthExchangeCode(code: string): Promise<(AuthTokens & { user: Partial<User> }) | null> {
    return this.tokenService.consumeExchangeCode<AuthTokens & { user: Partial<User> }>(code);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  private async generateTokens(user: User, sessionId?: string): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role, sessionId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
    ]);

    return { accessToken, refreshToken, sessionId };
  }

  private async saveRefreshToken(userId: string, rawToken: string): Promise<void> {
    const hashed = await bcrypt.hash(rawToken, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { refreshToken: hashed } });
  }
}
