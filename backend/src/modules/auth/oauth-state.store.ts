import { Request } from 'express';
import { TokenService } from './token.service';

interface StateStoreMetadata {
  authorizationURL: string;
  tokenURL: string;
  clientID: string;
}

type StoreCallback = (err: Error | null, state?: string) => void;
type VerifyCallback = (err: Error | null, ok: boolean, info?: { message: string }) => void;

/**
 * Custom passport-oauth2 state store backed by Redis, implementing the
 * `OAuth2Strategy.StateStore` interface (see @types/passport-oauth2).
 *
 * Passport's default state handling requires `express-session`, which this
 * API doesn't use (it's a stateless JWT architecture). This store persists
 * the anti-CSRF `state` value in Redis for a short TTL instead, using the
 * same Redis connection/pattern as the rest of TokenService.
 */
export class RedisOAuthStateStore {
  constructor(private readonly tokenService: TokenService) {}

  store(req: Request, callback: StoreCallback): void;
  store(req: Request, meta: StateStoreMetadata, callback: StoreCallback): void;
  store(_req: Request, metaOrCallback: StateStoreMetadata | StoreCallback, maybeCallback?: StoreCallback): void {
    const callback = typeof metaOrCallback === 'function' ? metaOrCallback : maybeCallback;
    if (!callback) return;

    this.tokenService
      .createOAuthState()
      .then((state) => callback(null, state))
      .catch((err) => callback(err));
  }

  verify(req: Request, providedState: string, callback: VerifyCallback): void;
  verify(req: Request, providedState: string, meta: StateStoreMetadata, callback: VerifyCallback): void;
  verify(
    _req: Request,
    providedState: string,
    metaOrCallback: StateStoreMetadata | VerifyCallback,
    maybeCallback?: VerifyCallback,
  ): void {
    const callback = typeof metaOrCallback === 'function' ? metaOrCallback : maybeCallback;
    if (!callback) return;

    if (!providedState) {
      callback(null, false, { message: 'Missing OAuth state parameter.' });
      return;
    }

    this.tokenService
      .consumeOAuthState(providedState)
      .then((valid) => {
        if (!valid) {
          callback(null, false, { message: 'Invalid or expired sign-in attempt. Please try again.' });
          return;
        }
        callback(null, true);
      })
      .catch((err) => callback(err, false));
  }
}
