import { Box } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import { Skeleton, useDisclosure } from "@chakra-ui/react";
import { Header } from "./header";
import SideBar from "./sideBar";
import { TaskForm } from "./form/taskForm";
import Tasks from "./table/tasks";
import { useProfile } from "../lib/hooks";
import { handleAuthError } from "../lib/errors";

const TodoLayout = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading, error } = useProfile();

  if (error) {
    if (!handleAuthError(error, router)) {
      throw error;
    }
  }

  return (
    <Box width="100vw" height="100vh">
      <TaskForm isOpen={isOpen} onClose={onClose} />
      <Skeleton height="50px" isLoaded={!isLoading}>
        <Header onOpenTaskForm={onOpen} />
      </Skeleton>
      <SideBar />
      <Box marginLeft="300px">
        <Tasks onOpenTaskForm={onOpen} />
      </Box>
    </Box>
  );
};

export default TodoLayout;
