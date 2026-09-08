import {
  Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res, Delete, Param, BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/roles.decorator';
import { getPrimaryFrontendUrl } from '../../common/utils/cors-origin.util';
import { User } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Cookie attributes for the httpOnly refresh-token cookie.
   *
   * SameSite=None (+ Secure, which browsers require alongside it) is needed
   * whenever the frontend and backend are on different registrable domains —
   * the default for a Render backend + Vercel frontend unless both are put
   * under one shared custom domain (e.g. api.example.com + app.example.com),
   * in which case SameSite=Lax is preferable and can be set via COOKIE_SAME_SITE.
   */
  private getRefreshCookieOptions() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const sameSite = this.configService.get<'lax' | 'none' | 'strict'>(
      'COOKIE_SAME_SITE',
      isProduction ? 'none' : 'lax',
    );
    return {
      httpOnly: true,
      // SameSite=None is rejected by browsers unless Secure is also set.
      secure: isProduction || sameSite === 'none',
      sameSite,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    } as const;
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify email address' })
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth() {
    // Passport handles the redirect to Google's consent screen.
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
    const frontendUrl = getPrimaryFrontendUrl(this.configService);

    // GoogleAuthGuard already redirected with an error and ended the response.
    if ((req.user as { __oauthFailed?: boolean } | undefined)?.__oauthFailed) {
      return;
    }

    try {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const result = await this.authService.googleLogin(req.user as never, ip, userAgent);

      res.cookie('refreshToken', result.refreshToken, this.getRefreshCookieOptions());

      // Never put the access/refresh token in the redirect URL. Stash the
      // finished login result behind a one-time code and hand the SPA only
      // that code; it exchanges it for real tokens via POST /auth/google/exchange.
      const code = await this.authService.createOAuthExchangeCode(result);

      res.redirect(`${frontendUrl}/auth/google/callback?code=${code}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed. Please try again.';
      res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(message)}`);
    }
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('google/exchange')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange a one-time Google OAuth code for application tokens' })
  async googleExchange(@Body('code') code: string) {
    if (!code) throw new BadRequestException('Missing exchange code');

    const result = await this.authService.consumeOAuthExchangeCode(code);
    if (!result) {
      throw new BadRequestException('This sign-in attempt has expired or was already used. Please try again.');
    }

    const { refreshToken: _refreshToken, ...publicTokens } = result;
    return publicTokens;
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    const result = await this.authService.login(dto, ip, userAgent);
    
    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.refreshToken, this.getRefreshCookieOptions());

    // Remove refreshToken from JSON response payload
    const { refreshToken: _refreshToken, ...publicTokens } = result;
    return publicTokens;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get new access token using refresh token cookie' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    // Attempt to get refresh token from cookies first, fallback to body if needed (for mobile)
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const userId = req.body?.userId;
    const sessionId = req.body?.sessionId;

    if (!token || !userId) {
      throw new BadRequestException('Missing refresh token or userId');
    }

    const result = await this.authService.refreshTokens(userId, token, sessionId);

    res.cookie('refreshToken', result.refreshToken, this.getRefreshCookieOptions());

    const { refreshToken: _refreshToken, ...publicTokens } = result;
    return publicTokens;
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current session' })
  async logout(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const sessionId = req.body?.sessionId;
    await this.authService.logout(user.id, sessionId);
    res.clearCookie('refreshToken', this.getRefreshCookieOptions());
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active sessions' })
  getSessions(@CurrentUser() user: User) {
    return this.authService.getSessions(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sessions/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke a specific session' })
  revokeSession(@CurrentUser() user: User, @Param('id') sessionId: string) {
    return this.authService.revokeSession(user.id, sessionId);
  }
}
