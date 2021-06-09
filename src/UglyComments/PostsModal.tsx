import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Box } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Select } from "@chakra-ui/select";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ErrorBondary, Loader } from "shared";
import { getPosts } from "./slice";
import { RootState, useAppDispatch } from "./store";

interface PostsModalProps {
  userId: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onConfirm: (id: string) => void;
}
export const PostsModal: React.FC<PostsModalProps> = ({
  userId,
  isOpen,
  onOpen,
  onClose,
  onConfirm,
}) => {
  const [postId, setPostId] = useState<string>("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPosts(userId));
  }, [dispatch, userId]);

  const handleConfirm = useCallback(() => {
    onConfirm(postId);
    onClose();
  }, [onClose, onConfirm, postId]);

  const { isLoadingPosts, errorPosts, posts } = useSelector(
    (state: RootState) => state.uglyComments
  );
  return (
    <>
      <Box>
        <Button isDisabled onClick={onOpen}>
          choose post
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Loader isLoading={isLoadingPosts}>
              <ErrorBondary isError={Boolean(errorPosts)} message={errorPosts}>
                <FormControl>
                  <FormLabel>List of posts</FormLabel>
                  <Select
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                  >
                    <option value="" selected={false} disabled={true}>
                      Choose post
                    </option>
                    {posts.map((post) => (
                      <option key={post.id} value={post.id}>
                        {post.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </ErrorBondary>
            </Loader>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={handleConfirm}
              isDisabled={isLoadingPosts || Boolean(errorPosts)}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
