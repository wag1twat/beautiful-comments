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
import { getUsers } from "./slice";
import { RootState, useAppDispatch } from "./store";

interface UsersModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onConfirm: (id: string) => void;
}
export const UsersModal: React.FC<UsersModalProps> = ({
  onConfirm,
  isOpen,
  onOpen,
  onClose,
}) => {
  const [userId, setUserId] = useState<string>("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleConfirm = useCallback(() => {
    onConfirm(userId);
    // other fn(...)
    // other fn(...)
    onClose();
  }, [onClose, onConfirm, userId]);

  const { isLoadingUsers, errorUsers, users } = useSelector(
    (state: RootState) => state.uglyComments
  );
  return (
    <>
      <Box>
        <Button onClick={onOpen}>choose user</Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose user</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Loader isLoading={isLoadingUsers}>
              <ErrorBondary isError={Boolean(errorUsers)} message={errorUsers}>
                <FormControl>
                  <FormLabel>List of users</FormLabel>
                  <Select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  >
                    <option value="" selected={false} disabled={true}>
                      Choose user
                    </option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
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
              isDisabled={isLoadingUsers || Boolean(errorUsers)}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
