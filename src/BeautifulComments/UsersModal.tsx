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
import { useUsers } from "./hooks/useUsers";

interface UsersModalProps {
  isOpen: boolean;
  onClose: <T>(reason: T) => void;
  onConfirm: <T>(value: T) => void;
}

const Component: React.FC<UsersModalProps> = ({
  isOpen,
  onConfirm,
  onClose,
}) => {
  const [id, setId] = useState<string>("");

  const { get, isLoading, error, result } = useUsers();

  useEffect(() => {
    get();
  }, [get]);

  return (
    <Modal isOpen={isOpen} onClose={() => onClose("on-close-users-modal")}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose user</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Loader isLoading={isLoading}>
            <ErrorBondary isError={Boolean(error)} message={error}>
              <FormControl>
                <FormLabel>List of users</FormLabel>
                <Select value={id} onChange={(e) => setId(e.target.value)}>
                  <option value="" disabled={true}>
                    Choose user
                  </option>
                  {result?.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.name}
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
            onClick={() => onClose("on-close-users-modal")}
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

export const UsersModal = withPromisifyModalController<
  BasePromisifyModalProps<string>
>(React.memo(Component));
