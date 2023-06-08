import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";
import Link from "next/link";
import { auth } from "../../lib/mutations";

const AuthForm: FC<{ mode: "signin" | "signup" }> = ({ mode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      await auth(mode, { email, password });
      setIsLoading(false);
      router.replace("/");
    } catch (e) {
      // TODO handle error on modals
      alert(e.message);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Box height="100vh" width="100vw">
      <Flex justify="center" align="center" height="calc(100vh - 0px)">
        <Box padding={10} borderRadius="6px" maxWidth={400}>
          <Heading paddingBottom={8}>
            {mode === "signin" ? "Login In" : "Sign Up"}
          </Heading>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              marginTop={3}
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              marginTop={3}
              type="submit"
              bg="red.500"
              width="100%"
              sx={{ "&:hover": { bg: "red.600" } }}
              color="white"
            >
              {mode === "signin" ? "Log in" : "Sign Up"}
            </Button>
          </form>
          <Divider marginTop={3} />
          {mode === "signin" && (
            <Center>
              <Link href="/signup">Don’t have an account? Sign up</Link>
            </Center>
          )}
          {mode === "signup" && (
            <Center>
              <Link href="/signin">Already have an account? Sign in</Link>
            </Center>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default AuthForm;
