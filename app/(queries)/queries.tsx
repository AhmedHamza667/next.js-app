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

export const GET_CURRENT_USER = gql`
query Me {
  me {
    _id
    firstName
    lastName
    email
    profileImage
    role
  }
}
`;
export const ADD_USER = gql`
mutation CreateAdminUser($input: CreateAdminUserInput!) {
  createAdminUser(input: $input) {
    firstName
    lastName
    email
    role
    _id
  }
}
`;

export const UPDATE_USER = gql`
mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    _id
    firstName
    lastName
    profileImage
    email
    role
  }
}
`;

export const GET_SIGNED_URL = gql`
  query GetSignedUrl($fileName: String!, $fileType: FileType!) {
    getSignedUrl(fileName: $fileName, fileType: $fileType)
  }
`;
