import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

//todo load all from env
export const authConfig: AuthConfig = {
  issuer: `${environment.authUrl}`,
  logoutUrl: `${environment.authUrl}/logout`,
  clientId: 'algashop-admin-client',
  responseType: 'code',
  redirectUri: window.location.origin + '/',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: 'openid write read',
  useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
  silentRefreshTimeout: 5000, // For faster testing
  timeoutFactor: 0.25, // For faster testing
  sessionChecksEnabled: true,
  disablePKCE: false,
  oidc: true,
  requireHttps: false,
  //dummyClientSecret: 'admin123',
  showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  //nonceStateSeparator : 'semicolon' // Real semicolon gets mangled by Duende ID Server's URI encoding
};