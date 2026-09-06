import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { getPrimaryFrontendUrl } from '../../../common/utils/cors-origin.util';

/**
 * Wraps passport's 'google' strategy guard so that failures (user cancels
 * consent, invalid/expired CSRF state, Google API error, etc.) redirect the
 * browser back to the frontend with a readable error instead of surfacing a
 * raw JSON 401 to a top-level browser navigation.
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
    if (err || !user) {
      const res = context.switchToHttp().getResponse<Response>();
      const frontendUrl = getPrimaryFrontendUrl(this.configService);
      const reason =
        info?.message || err?.message || 'Google sign-in failed or was cancelled. Please try again.';
      res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(reason)}`);
      // Marker consumed by the controller so it doesn't try to write to the
      // response again — handleRequest already sent one via res.redirect().
      return { __oauthFailed: true } as unknown as TUser;
    }
    return user as TUser;
  }
}
