import {
  Box,
  Flex,
  Icon,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetcher } from "../lib/fetcher";
import { NewProject } from "./form/projectForm";
import ProjectList from "./list/projectList";
import { handleAuthError } from "../lib/errors";

const SideBar = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, mutate, error } = useSWR("/project", fetcher);

  if (error) {
    if (!handleAuthError(error, router)) {
      throw error;
    }
  }

  if (!data) {
    return (
      <Box
        position="absolute"
        top="0"
        marginTop="50px"
        height="calc(100vh - 50px)"
        width="300px"
        left="0"
        bg="gray.50"
      >
        <Stack padding={6}>
          {Array.from({ length: 22 }, (_, i) => (
            <Skeleton key={i} height="30px" isLoaded={!data} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      position="absolute"
      top="0"
      marginTop="50px"
      height="calc(100vh - 50px)"
      width="300px"
      left="0"
      bg="gray.50"
    >
      <NewProject isOpen={isOpen} onClose={onClose} onUpdate={mutate} />
      <Box paddingX="10px" paddingTop="40px">
        <ProjectList projects={data.system} />
      </Box>
      <Box paddingTop="30px" paddingX="10px">
        <List>
          <ListItem _hover={{ backgroundColor: "gray.200" }} rounded="md">
            <Flex paddingTop={2} paddingLeft={1}>
              <Text fontSize="xl" as="b" color="gray.500">
                Favorites
              </Text>
              <Spacer />
              <Tooltip label="Add Project" hasArrow>
                <IconButton
                  aria-label=""
                  variant="unstyled"
                  textColor="gray.500"
                  _hover={{ textColor: "gray.900" }}
                >
                  <Icon as={MdAdd} boxSize={6} />
                </IconButton>
              </Tooltip>
            </Flex>
          </ListItem>
        </List>
        <Box paddingX="10px">
          <ProjectList projects={data.favourites} />
        </Box>
      </Box>
      <Box paddingTop="30px" paddingX="10px">
        <List>
          <ListItem _hover={{ backgroundColor: "gray.200" }} rounded="md">
            <Flex paddingTop={2} paddingLeft={1}>
              <Text fontSize="xl" as="b" color="gray.500">
                Projects
              </Text>
              <Spacer />
              <Tooltip label="Add Project" hasArrow>
                <IconButton
                  aria-label=""
                  variant="unstyled"
                  textColor="gray.500"
                  _hover={{ textColor: "gray.900" }}
                  onClick={onOpen}
                >
                  <Icon as={MdAdd} boxSize={6} />
                </IconButton>
              </Tooltip>
            </Flex>
          </ListItem>
        </List>
        <Box paddingX="10px">
          <ProjectList projects={data.user} />
        </Box>
      </Box>
    </Box>
  );
};

export default SideBar;
