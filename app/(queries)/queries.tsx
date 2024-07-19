import { gql } from "@apollo/client";

export const LOGIN_BY_EMAIL = gql`
query LoginByEmail($input: LoginByEmail!) {
  loginByEmail(input: $input) {
    message
    resendOTPToken
  }
}
`;

export const verifyOTP = gql`
  query verify_OTP($otp: String!, $email: EmailAddress!) {
    verifyOTP(otp: $otp, email: $email) {
      accessToken
      refreshToken
    }
  }
`;

export const resendOTPQuery = gql`
  query ResendOTP($resendOtpToken: String!) {
    resendOTP(resendOTPToken: $resendOtpToken) {
      message
      status
    }
  }
`;
