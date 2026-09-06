import { ConfigService } from '@nestjs/config';

/** Parses CORS_ORIGIN into a list — supports one URL or a comma-separated list. */
export function getCorsOrigins(configService: ConfigService): string[] {
  const raw = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/**
 * The single frontend URL to redirect to after the Google OAuth callback.
 * A redirect can only target one URL, so when CORS_ORIGIN lists several
 * (e.g. a production domain plus a www. alias), the first one wins —
 * put your primary/canonical frontend URL first.
 */
export function getPrimaryFrontendUrl(configService: ConfigService): string {
  return getCorsOrigins(configService)[0] ?? 'http://localhost:5173';
}
