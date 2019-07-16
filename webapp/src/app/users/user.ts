import {Role} from "./role";

export class User {
  id: number;
  name: string;
  password: string;
  active: boolean;
  roles: Array<Role>;
}
