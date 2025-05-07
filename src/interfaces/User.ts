export default interface User {
  id: number;
  username: string;
  friends?: User[];
}
