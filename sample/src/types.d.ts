export interface UserCreatedEvent {
  id: number;
  email: string;
  username: string;
}
export interface EmailSentEvent {
  email: string;
  template: string;
  success: boolean;
}
