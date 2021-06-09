import { User } from "types";
import { useGet } from "./useGet";

export const useUsers = () => {
  return useGet<User[]>("https://jsonplaceholder.typicode.com/users");
};
