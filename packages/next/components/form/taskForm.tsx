import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Flex,
  HStack,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useProjects } from "../../lib/hooks";
import { createTask, updateTask } from "../../lib/mutations";
import { safeParseDate } from "../../lib/safeTypes";
import { DueDatePicker } from "../select/dueDatePicker";
import { PriorityPicker } from "../select/priorityPicker";
import { handleAuthError } from "../../lib/errors";

const TaskForm = ({ isOpen, onClose }) => {
  const router = useRouter();
  const activeProject = useStoreState((state: any) => state.activeProject);
  const setLastTaskMutation = useStoreActions(
    (state: any) => state.setLastTaskMutation
  );
  const activeTask = useStoreState((state: any) => state.activeTask);
  const setActiveTask = useStoreActions((state: any) => state.setActiveTask);

  const [name, setName] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [priority, setPriority] = useState(null);
  const [deadline, setDeadline] = useState(null as Date);
  const [description, setDescription] = useState(null);

  const { projects, isLoading, error } = useProjects("flat");

  const handleClose = () => {
    setName(null);
    setProjectId(null);
    setPriority(null);
    setDeadline(null);
    setDescription(null);
    setActiveTask({});
    onClose();
  };

  if (error) {
    if (!handleAuthError(error, router)) {
      throw error;
    }
  }

  if (isLoading || error) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let task;
      if (activeTask.id) {
        task = await updateTask({
          taskId: activeTask.id,
          name: name || activeTask.name,
          description: description || activeTask.description,
          deadline: deadline || activeTask.deadline,
          projectId: projectId || activeProject.id,
          priority: priority || activeTask.priority,
        });
      } else {
        task = await createTask({
          name,
          description,
          deadline,
          projectId: projectId || activeProject.id,
          priority: priority || null,
        });
      }
      setLastTaskMutation(task);
      handleClose();
    } catch (e) {
      // TODO handle error on modals
      alert(e.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{activeTask.id ? "Edit" : "Add"} Task</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl
              isRequired
              isInvalid={name === "" || activeTask.name === ""}
            >
              <Box>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name Your Task"
                  onChange={(e) => {
                    setName(e.target.value);
                    // eslint-disable-next-line no-shadow
                    const { name, ...rest } = activeTask;
                    setActiveTask({ ...rest });
                  }}
                  value={name || activeTask.name}
                />
              </Box>
              <FormErrorMessage>Task name is required.</FormErrorMessage>
            </FormControl>
            <FormControl>
              <Box paddingTop={2}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Add Some Detail"
                  value={description || activeTask.description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    // eslint-disable-next-line no-shadow
                    const { description, ...rest } = activeTask;
                    setActiveTask({ ...rest });
                  }}
                />
              </Box>
            </FormControl>
            <Flex paddingTop={4}>
              <HStack spacing={1}>
                <DueDatePicker
                  dueDate={deadline || safeParseDate(activeTask.deadline)}
                  setDueDate={setDeadline}
                />
                <PriorityPicker
                  priority={priority || activeTask.priority}
                  setPriority={setPriority}
                />
              </HStack>
            </Flex>
            <FormControl>
              <Box paddingTop={2}>
                <FormLabel>Project</FormLabel>

                <Select
                  placeholder="Select option"
                  value={projectId || activeProject.id}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  {projects.system
                    .concat(projects.user)
                    .filter((p) => p.subtype === "task")
                    .map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                </Select>
              </Box>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={1}>
              {activeTask.id ? "Save" : "Add"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export { TaskForm };
