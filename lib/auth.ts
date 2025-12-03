import jwt from "jsonwebtoken";
import { HTTP_STATUS, ERROR_TYPES } from "./constants";
import { AppError } from "./utils/helper";

export interface DecodedToken {
  _id: string;
  email: string;
}

export const verifyToken = (tokenString: string): DecodedToken => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
  try {
    return jwt.verify(tokenString, JWT_SECRET_KEY) as DecodedToken;
  } catch (err: any) {
    const message = err.name === "TokenExpiredError" ? "Token expired" : "Token is invalid";
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, message, ERROR_TYPES.UNAUTHORIZED);
  }
};
