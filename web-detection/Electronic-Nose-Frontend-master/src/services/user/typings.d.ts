interface LoginResult {
  errorCode: number,
  success?: boolean,
  data?: UserInfo
}

interface UserInfo {
  ID: number
  Username: string
  Email: string
}

interface LoginInfo {
  Id: string;
  password: string;
}

interface SignUp{
  Username: string
  password: string;
}