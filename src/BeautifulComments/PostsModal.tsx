import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
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
import React, { useEffect, useState } from "react";
import { ErrorBondary, Loader } from "shared";
import {
  BasePromisifyModalProps,
  withPromisifyModalController,
} from "./withPromisifyModalController";
import { usePostsByUserId } from "./hooks/usePostsByUserId";

interface PostsModalProps {
  userId: string;
  isOpen: boolean;
  onClose: <T>(reason: T) => void;
  onConfirm: <T>(value: T) => void;
}

const Component: React.FC<PostsModalProps> = ({
  userId,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [id, setId] = useState<string>("");

  const { get, isLoading, error, result } = usePostsByUserId(userId);

  useEffect(() => {
    get();
  }, [get]);

  return (
    <Modal isOpen={isOpen} onClose={() => onClose("on-close-posts-modal")}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Loader isLoading={isLoading}>
            <ErrorBondary isError={Boolean(error)} message={error}>
              <FormControl>
                <FormLabel>List of posts</FormLabel>
                <Select value={id} onChange={(e) => setId(e.target.value)}>
                  <option value="" disabled={true}>
                    Choose post
                  </option>
                  {result?.map((post) => (
                    <option key={post.id} value={String(post.id)}>
                      {post.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ErrorBondary>
          </Loader>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => onClose("on-close-posts-modal")}
          >
            Close
          </Button>
          <Button
            variant="ghost"
            onClick={() => onConfirm(id)}
            isDisabled={isLoading || Boolean(error)}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const PostsModal = withPromisifyModalController<
  {
    userId: string;
  } & BasePromisifyModalProps<string>
>(React.memo(Component));
