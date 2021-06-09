import { Flex, Text } from "@chakra-ui/layout";
import React from "react";

interface ErrorBondaryProps {
  isError: boolean;
  message?: string | null;
}

export const ErrorBondary: React.FC<ErrorBondaryProps> = ({
  isError,
  message,
  children,
}) => {
  if (isError) {
    return (
      <Flex as="section" justify="center" alignItems="center">
        <Text color="red.500">{message}</Text>
      </Flex>
    );
  }

  return <>{children}</>;
};
