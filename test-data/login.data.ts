import { NegativeLoginCase, UserCredentials } from "./login.types";

export const validUser: UserCredentials = {
  username: "standard_user",
  password: "secret_sauce",
};

export const negativeLoginCases: NegativeLoginCase[] = [
  {
    scenario: "Locked out user",
    username: "locked_out_user",
    password: "secret_sauce",
    expectedError: "Sorry, this user has been locked out.",
  },
  {
    scenario: "Empty username and password",
    username: "",
    password: "",
    expectedError: "Username is required",
  },
  {
    scenario: "Empty password",
    username: "standard_user",
    password: "",
    expectedError: "Password is required",
  },
  {
    scenario: "Invalid credentials",
    username: "invalid_user",
    password: "wrong_password",
    expectedError:
      "Username and password do not match any user in this service",
  },
];
