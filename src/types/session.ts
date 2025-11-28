import { IDocument, UserProfile } from "./user";

export interface Session extends IDocument {
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed' | 'reviewed';
  from: UserProfile; 
  to: UserProfile;  
  topic: string;
  problem: string;
  startDateTime: string;
  endDateTime: string;
  gEventLink: string;
}