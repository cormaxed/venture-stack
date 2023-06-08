import React, { FC } from "react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  Center,
} from "@chakra-ui/react";

const ErrorAlert: FC<{ message: string }> = ({ message }) => {
  return (
    <Center>
      <Box top="50%" position="absolute" padding={4}>
        <Box border="1px solid" borderRadius={6} maxWidth={600}>
          <Alert
            variant="subtle"
            status="error"
            flexDirection="column"
            borderTopRadius={6}
            minWidth="sm"
          >
            <AlertTitle>Ooops! Something Went Wrong</AlertTitle>
            <AlertDescription maxWidth="lg">{message}</AlertDescription>
          </Alert>
          <Box padding={2}>
            <Center>
              <Button
                colorScheme="blue"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
            </Center>
          </Box>
        </Box>
      </Box>
    </Center>
  );
};

export default ErrorAlert;
