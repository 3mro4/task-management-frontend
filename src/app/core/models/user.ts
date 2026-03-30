export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  password: string;
}