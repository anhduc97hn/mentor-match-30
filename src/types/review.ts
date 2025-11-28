import { IDocument } from "./user";
import { Session } from "./session";

export interface Review extends IDocument{
  content: string;
  rating: number;
  sessionId: string; // session._id
  session?: Session
  
}