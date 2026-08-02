import Cookies from 'js-cookie';

const TOKEN_KEY = 'verifinews_token';
const ROLE_KEY = 'verifinews_role';

// Stored in cookies (not localStorage) so the Next.js middleware — which runs
// on the server before the page renders — can read it to protect routes.
export function setAuth(token: string, role: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 1, sameSite: 'lax' });
  Cookies.set(ROLE_KEY, role, { expires: 1, sameSite: 'lax' });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getRole(): string | undefined {
  return Cookies.get(ROLE_KEY);
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}
