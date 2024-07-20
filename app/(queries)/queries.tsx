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

export const GET_ALL_USER = gql`
  query GetAllUser($search: String, $filter: JSON, $sort: JSON, $limit: Int, $offset: Int, $getAllUserCountSearch2: String, $getAllUserCountFilter2: JSON) {
    getAllUser(search: $search, filter: $filter, sort: $sort, limit: $limit, offset: $offset) {
      _id
      firstName
      lastName
      email
      role
      profileImage
    }
    getAllUserCount(search: $getAllUserCountSearch2, filter: $getAllUserCountFilter2)
  }
`;
