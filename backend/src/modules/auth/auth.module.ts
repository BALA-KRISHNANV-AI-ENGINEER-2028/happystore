import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { TokenService } from './token.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRATION', '15m') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GoogleAuthGuard, TokenService],
  exports: [AuthService, JwtModule, TokenService],
})
export class AuthModule {}
