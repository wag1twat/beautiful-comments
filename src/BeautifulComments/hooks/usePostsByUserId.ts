import { Post } from "types";
import { useGet } from "./useGet";

export const usePostsByUserId = (userId: string) => {
  return useGet<Post[]>(
    `https://jsonplaceholder.typicode.com/users/${userId}/posts`
  );
};
