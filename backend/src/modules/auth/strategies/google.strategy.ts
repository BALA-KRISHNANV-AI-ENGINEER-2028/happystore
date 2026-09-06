import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token.service';
import { RedisOAuthStateStore } from '../oauth-state.store';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService, tokenService: TokenService) {
    const options: StrategyOptions = {
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'placeholder'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', 'placeholder'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL', 'http://localhost:4000/api/auth/google/callback'),
      scope: ['email', 'profile'],
      // Redis-backed anti-CSRF state (this API is stateless/JWT-based, no express-session).
      store: new RedisOAuthStateStore(tokenService),
    };
    super(options);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const { name, emails, photos, id } = profile;
    // Google's raw profile payload includes `email_verified`; the typed `Profile.emails`
    // shape does not expose it, so we read it off the underlying JSON response.
    const rawJson = (profile as unknown as { _json?: { email_verified?: boolean } })._json;

    const user = {
      googleId: id,
      email: emails?.[0]?.value,
      emailVerified: rawJson?.email_verified ?? true,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
    };
    done(null, user);
  }
}
