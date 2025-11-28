import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export const isValidToken = (accessToken: string | null | undefined): boolean => {
  if (!accessToken) {
    return false;
  }

  const decoded: JwtPayload = jwtDecode(accessToken);
  const currentTime: number = Date.now() / 1000;

  return decoded.exp > currentTime;
};
