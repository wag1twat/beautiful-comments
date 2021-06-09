import { Button } from "@chakra-ui/button";
import { Box, Code, Stack } from "@chakra-ui/layout";
import React, { useCallback, useEffect, useState } from "react";
import { CommentsList, ErrorBondary, Loader } from "shared";
import { PostsModal } from "./PostsModal";
import { UsersModal } from "./UsersModal";
import { useCommentsByPostId } from "./hooks/useCommentsByPostId";

export const BeautifulComments: React.FC = () => {
  const [postId, setPostId] = useState<string>("");

  const [userId, setUserId] = useState<string>("");

  const { get, isLoading, error, result } = useCommentsByPostId(postId);

  useEffect(() => {
    get();
  }, [get]);

  const [openUsers, setOpenUsers] = useState<() => Promise<string>>();

  const [openPosts, setOpenPosts] = useState<() => Promise<string>>();

  const handleOpenUsersModal = useCallback(async () => {
    if (openUsers && openPosts) {
      try {
        const userId = await openUsers();

        setUserId(userId);

        const postId = await openPosts();

        setPostId(postId);

        // const commentId = await openComments()

        // setCommentId(commentId)
      } catch (e) {
        setUserId("");
        setPostId("");
        console.log("Reject reason -", e.message);
      }
    }
  }, [openUsers, openPosts]);

  return (
    <>
      <UsersModal createOpen={setOpenUsers} />
      <PostsModal userId={userId} createOpen={setOpenPosts} />
      <Box as="section">
        <Box p={4}>
          <Code>{JSON.stringify({ userId, postId }, null, 2)}</Code>
        </Box>
        <Stack as="section" spacing={4} p={4} direction="row">
          <Button onClick={handleOpenUsersModal}>choose user</Button>
          <Button isDisabled>choose post</Button>
        </Stack>
        <Loader isLoading={isLoading}>
          <ErrorBondary isError={Boolean(error)} message={error}>
            <CommentsList comments={result} />
          </ErrorBondary>
        </Loader>
      </Box>
    </>
  );
};
