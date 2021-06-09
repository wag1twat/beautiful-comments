import { Comment } from "types";
import { useGet } from "./useGet";

export const useCommentsByPostId = (postId: string) => {
  return useGet<Comment[]>(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
};
