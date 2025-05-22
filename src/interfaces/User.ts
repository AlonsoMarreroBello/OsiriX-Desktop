export default interface User {
  id?: number;
  email: string;
  username: string;
  password: string;
}

export interface UserSimple {
  id: number;
  username: string;
  email: string;
}
