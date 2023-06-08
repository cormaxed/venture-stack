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
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useStoreActions } from "easy-peasy";
import { useUserProjects } from "../../lib/hooks";
import { createProject } from "../../lib/mutations";
import { handleAuthError } from "../../lib/errors";

const ProjectForm = ({ isOpen, onClose, onUpdate }) => {
  const router = useRouter();
  const setLastProjectMutation = useStoreActions(
    (state: any) => state.setLastProjectMutation
  );
  const [color, setColor] = useState("gray.500");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(null);

  const { projects, mutate, isLoading, error } = useUserProjects();

  const handeUpdate = () => {
    onUpdate();
    mutate();
    setParentId(null);
    setName("");
    setColor("gray.500");
  };

  const onSubmit = async () => {
    try {
      const result = await createProject({ name, color, parentId });
      setLastProjectMutation(result);
      handeUpdate();
      onClose();
    } catch (e) {
      // TODO handle error on modals
      alert(e);
    }
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    if (!handleAuthError(error, router)) {
      throw error;
    }
  }

  const colors = [
    "gray.500",
    "gray.300",
    "red.500",
    "orange.500",
    "yellow.300",
    "cyan.300",
    "blue.300",
    "blue.600",
    "green.300",
    "green.500",
    "purple.600",
    "pink.400",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <Box>
              <FormLabel>Name</FormLabel>
              <Input onChange={(e) => setName(e.target.value)} />
            </Box>
            <Box paddingTop={4}>
              <FormLabel>Parent Project</FormLabel>
              <Select
                placeholder="Select option"
                onChange={(e) => setParentId(e.target.value)}
              >
                {projects.user.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </Box>
            <Box paddingTop={4}>
              <FormLabel>Color</FormLabel>
              <SimpleGrid columns={3} spacing={2}>
                {colors.map((c) => (
                  <Button
                    key={c}
                    aria-label={c}
                    background={c}
                    borderRadius={0}
                    height="44px"
                    padding={0}
                    outline={color === c ? "2px solid" : "none"}
                    _hover={{ background: c }}
                    onClick={() => {
                      setColor(c);
                    }}
                  />
                ))}
              </SimpleGrid>
            </Box>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            onClick={() => onSubmit()}
            colorScheme="blue"
            mr={1}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { ProjectForm as NewProject };
