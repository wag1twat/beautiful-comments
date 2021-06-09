import { Box, Stack } from "@chakra-ui/layout";
import React from "react";
import { Comment } from "types";

interface CommentsListProps {
  comments?: Comment[];
}

export const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
  return (
    <Stack as="section" m={4} spacing={4}>
      {comments?.map(({ id, name, body, postId, email }) => {
        return (
          <Stack
            key={id}
            spacing={4}
            p={4}
            border="1px solid"
            borderColor="blue.200"
            borderRadius={4}
          >
            <Box>
              <span>Comment ID:</span>
              <span>{id}</span>
            </Box>
            <Box>
              <span>Post ID:</span>
              <span>{postId}</span>
            </Box>
            <Box>
              <span>Name:</span>
              <span>{name}</span>
            </Box>
            <Box>
              <label>Body:</label>
              <div>{body}</div>
            </Box>
            <Box>
              <span>Email:</span>
              <span>{email}</span>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
};
