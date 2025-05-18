import { UserAuthenticatedResponse } from './userAuthenticated-response';

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
  userAuthenticated: UserAuthenticatedResponse;
}
