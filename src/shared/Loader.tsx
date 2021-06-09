import { Flex } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";
import React from "react";

interface LoaderProps {
  isLoading: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <Flex as="section" justify="center" align="center">
        <CircularProgress isIndeterminate />
      </Flex>
    );
  }

  return <>{children}</>;
};
