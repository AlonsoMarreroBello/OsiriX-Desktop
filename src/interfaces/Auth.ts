export interface AuthLoginRequestDto {
  email: string;
  password: string;
  origin: string;
}

export interface AuthLoginResponseDto {
  token: string;
  tokenType: string;
}

export interface AuthRegisterRequestDto {
  username: string;
  email: string;
  password: string;
}

export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
  userId: number;
}
