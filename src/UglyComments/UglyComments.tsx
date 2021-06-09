import React, { useEffect, useState } from "react";
import { RootState, useAppDispatch } from "./store";
import { getCommentByPostId } from "./slice";
import { useSelector } from "react-redux";
import { Loader, ErrorBondary, CommentsList } from "shared";
import { PostsModal } from "./PostsModal";
import { Box, Code, Stack } from "@chakra-ui/layout";
import { UsersModal } from "./UsersModal";
import { useDisclosure, usePrevious } from "@chakra-ui/hooks";

export const UglyComments: React.FC = () => {
  const [postId, setPostId] = useState<string>("");

  const [userId, setUserId] = useState<string>("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCommentByPostId(postId));
  }, [dispatch, postId]);

  const { isLoadingСomments, errorComments, comments } = useSelector(
    (state: RootState) => state.uglyComments
  );

  const usersDisclosure = useDisclosure();

  const postsDisclosure = useDisclosure();

  const previousUserId = usePrevious(userId);

  useEffect(() => {
    if (!usersDisclosure.isOpen) {
      if (typeof previousUserId === "string" && userId !== previousUserId) {
        postsDisclosure.onOpen();
      }
    }
  }, [postsDisclosure, previousUserId, userId, usersDisclosure.isOpen]);
  return (
    <Box as="section">
      <Box p={4}>
        <Code>{JSON.stringify({ userId, postId }, null, 2)}</Code>
      </Box>
      <Stack as="section" spacing={4} p={4} direction="row">
        <UsersModal
          {...usersDisclosure}
          onConfirm={(userId) => setUserId(userId)}
        />
        <PostsModal
          {...postsDisclosure}
          userId={userId}
          onConfirm={(postId) => setPostId(postId)}
        />
      </Stack>
      <Loader isLoading={isLoadingСomments}>
        <ErrorBondary isError={Boolean(errorComments)} message={errorComments}>
          <CommentsList comments={comments} />
        </ErrorBondary>
      </Loader>
    </Box>
  );
};
