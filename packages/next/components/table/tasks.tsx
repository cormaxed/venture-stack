import { Flex, Text, IconButton, Skeleton } from "@chakra-ui/react";
import { Box, Center, Heading, Spacer, Stack } from "@chakra-ui/layout";
import { CheckIcon } from "@chakra-ui/icons";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useStoreActions, useStoreState } from "easy-peasy";

import { useRouter } from "next/router";
import { completeTask, deleteTask } from "../../lib/mutations";
import { DateIconText } from "../select/dateIconText";
import logger from "../../lib/client-logger";
import { getPriority } from "../select/priorityPicker";
import { useTask } from "../../lib/hooks";
import { formatDate } from "../../lib/dates";
import { handleAuthError } from "../../lib/errors";

const Tasks = ({ onOpenTaskForm }) => {
  const router = useRouter();
  const activeProject = useStoreState((state: any) => state.activeProject);
  const setLastTaskMutation = useStoreActions(
    (state: any) => state.setLastTaskMutation
  );
  const lastTaskMutation = useStoreState(
    (state: any) => state.lastTaskMutation
  );
  const setActiveTask = useStoreActions((state: any) => state.setActiveTask);

  const handleTaskStateChange = async (
    method: "complete" | "delete",
    taskId: string
  ) => {
    try {
      const task =
        method === "delete"
          ? await deleteTask({ taskId })
          : await completeTask({ taskId });
      setLastTaskMutation(task);
    } catch (e) {
      logger.error(e);
    }
  };

  const { data, isLoading, error } = useTask(
    activeProject.id,
    lastTaskMutation
  );

  if (error) {
    if (!handleAuthError(error, router)) {
      throw error;
    }
  }

  return (
    <Box paddingLeft={10} paddingTop={4}>
      {!isLoading ? (
        <Heading size="lg">{activeProject.name}</Heading>
      ) : (
        <Heading size="lg">Loading...</Heading>
      )}

      <Box marginTop="4" paddingRight={10}>
        {isLoading ? (
          <Stack spacing={4}>
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} height="40px" isLoaded={!isLoading} />
            ))}
          </Stack>
        ) : null}
        {data.map((task) => {
          return (
            <Box key={task.id} minHeight="60px" borderBottom="1px solid grey">
              <Flex>
                <Box marginTop="10px" marginBottom="10px">
                  <Center minHeight="40px">
                    <IconButton
                      borderRadius="full"
                      backgroundColor="white"
                      color="transparent"
                      border={`2px solid ${getPriority(task.priority).color}`}
                      _active={{ backgroundColor: "white" }}
                      _focus={{ backgroundColor: "white" }}
                      _hover={{ backgroundColor: "white" }}
                      aria-label=""
                      role="group"
                      size="xs"
                      onClick={() => {
                        handleTaskStateChange("complete", task.id);
                      }}
                    >
                      <CheckIcon _groupHover={{ color: "black" }} />
                    </IconButton>
                  </Center>
                </Box>
                <Box marginLeft="4" marginTop="10px" marginBottom="10px">
                  <Center minHeight="40px">
                    <Box>
                      <Text fontSize="xl">{task.name}</Text>
                      {task.deadline ? (
                        <DateIconText
                          value={new Date(task.deadline)}
                          dateFormatter={formatDate}
                        />
                      ) : null}
                    </Box>
                  </Center>
                </Box>
                <Spacer />
                <Box>
                  <Flex>
                    <Center>
                      <IconButton
                        backgroundColor="transparent"
                        aria-label=""
                        onClick={() => {
                          setActiveTask(task);
                          onOpenTaskForm();
                        }}
                      >
                        <AiOutlineEdit />
                      </IconButton>
                      <Center>
                        <IconButton
                          backgroundColor="transparent"
                          aria-label=""
                          onClick={() => {
                            handleTaskStateChange("delete", task.id);
                          }}
                        >
                          <AiOutlineDelete />
                        </IconButton>
                      </Center>
                    </Center>
                  </Flex>
                  {activeProject.subtype === "filter" ? (
                    <Box>
                      <Text align="right" color="gray.700">
                        {task.project_name}
                      </Text>
                    </Box>
                  ) : null}
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Tasks;
