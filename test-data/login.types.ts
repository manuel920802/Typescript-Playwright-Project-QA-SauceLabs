export interface NegativeLoginCase {
  scenario: string;
  username: string;
  password: string;
  expectedError: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
