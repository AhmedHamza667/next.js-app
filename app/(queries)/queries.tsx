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


export const GET_ALL_JOB = gql`
query GetAllJob(
  $search: String
  $filter: JSON
  $sort: JSON
  $limit: Int
  $offset: Int
) {
  getAllJob(
    search: $search
    filter: $filter
    sort: $sort
    limit: $limit
    offset: $offset
  ) {
    _id
    jobCode
    jobTitle
    jobCategory {
      _id
      categoryName
      __typename
    }
    startDate
    endDate
    status
    applicationsCount
    interviewsCount
    createdById
    lastAssignedToIds
    __typename
  }
  getAllJobCount(search: $search, filter: $filter)
}`;

export const GET_ALL_JOB_CATEGORY = gql`
query GetAllJobCategory(
  $search: String
  $limit: Int
  $offset: Int
  $sort: JSON
) {
  getAllJobCategory(
    search: $search
    limit: $limit
    offset: $offset
    sort: $sort
  ) {
    _id
    categoryName
    __typename
  }
  getAllJobCategoryCount(search: $search)
}`;

export const GET_ALL_HIRING_MANAGER = gql`
query GetAllHiringManagerUser(
  $search: String
  $filter: JSON
  $limit: Int
  $offset: Int
  $sort: JSON
) {
  getAllUser(
    search: $search
    filter: $filter
    limit: $limit
    offset: $offset
    sort: $sort
  ) {
    _id
    firstName
    lastName
    role
    email
    __typename
  }
  getAllUserCount(search: $search, filter: $filter)
}
`;
export const GET_ALL_HR_USER = gql`
query GetAllHRUser(
  $search: String
  $filter: JSON
  $limit: Int
  $offset: Int
  $sort: JSON
) {
  getAllUser(
    search: $search
    filter: $filter
    limit: $limit
    offset: $offset
    sort: $sort
  ) {
    _id
    firstName
    lastName
    role
    email
    __typename
  }
  getAllUserCount(search: $search, filter: $filter)
}`;

export const CREATE_JOB = gql`
mutation CreateJob($data: CreateJobInput!) {
  createJob(data: $data) {
    _id
    jobCode
    jobTitle
    jobCategory {
      _id
      categoryName
      __typename
    }
    startDate
    endDate
    status
    applicationsCount
    interviewsCount
    categoryId
    __typename
  }
}`;

export const GET_JOB_BY_ID = gql`
query GetJobById($id: ID!) {
  getJobById(_id: $id) {
    _id
    categoryId
    jobCategory {
      _id
      categoryName
      __typename
    }
    employmentType
    endDate
    jobCode
    jobDescription
    jobLocation
    jobTitle
    seniorityLevel
    startDate
    status
    workspaceType
    createdById
    createdBy {
      _id
      firstName
      lastName
      __typename
    }
    lastAssignedTos {
      _id
      email
      firstName
      lastName
      role
      __typename
    }
    emailConfiguration {
      interviewCompletionEmailTemplate
      interviewScheduleEmailTemplate
      rejectionTemplate
      __typename
    }
    __typename
  }
}
`;
export const GET_ONE_INTERVIEW_QUESTION = gql`
query GetOneInterviewQuestion($filter: JSON, $sort: JSON) {
  getOneInterviewQuestion(filter: $filter, sort: $sort) {
    _id
    jobId
    questions {
      questionIndex
      question
      systemAnswer
      __typename
    }
    __typename
  }
}`;