import { Center, Flex, HStack, List, ListItem, Text } from "@chakra-ui/layout";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  theme,
  useDisclosure,
} from "@chakra-ui/react";
import { MdCheck, MdFlag } from "react-icons/md";

const priorities = [
  { level: 1, label: "P1", name: "Priority 1", color: theme.colors.red[500] },
  {
    level: 2,
    label: "P2",
    name: "Priority 2",
    color: theme.colors.orange[500],
  },
  { level: 3, label: "P3", name: "Priority 3", color: theme.colors.blue[500] },
  { level: 4, label: "P4", name: "Priority 4", color: theme.colors.gray[300] },
];

export const getPriority = (level: number) => {
  if (level) {
    return priorities[level - 1];
  }

  return { level: -1, label: "Priority", name: "Priority", color: "black" };
};

const PriorityPicker = ({ priority, setPriority }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handlePriorityChange = (value: number) => {
    setPriority(value);
    onClose();
  };

  return (
    <Popover
      placement="bottom"
      onClose={onClose}
      isOpen={isOpen}
      onOpen={onOpen}
    >
      <PopoverTrigger>
        <Flex
          border="2px solid"
          borderColor="gray.300"
          borderRadius={6}
          paddingLeft={3}
          paddingRight={3}
          paddingTop={1}
          paddingBottom={1}
          _hover={{ backgroundColor: "gray.200" }}
        >
          <Center>
            <MdFlag size={20} color={getPriority(priority).color} />
            <Text paddingLeft={2} fontSize="md">
              {getPriority(priority).label}
            </Text>
          </Center>
        </Flex>
      </PopoverTrigger>
      <PopoverContent width="170px">
        <PopoverArrow />
        <PopoverBody>
          <List>
            {priorities.map((p) => (
              <ListItem
                key={p.level}
                _hover={{ backgroundColor: "gray.200" }}
                onClick={() => handlePriorityChange(p.level)}
              >
                <HStack>
                  <MdFlag size={20} color={p.color} />
                  <Text paddingLeft={2} fontSize="md">
                    {p.name}
                  </Text>
                  {p.level === priority ? <MdCheck /> : null}
                </HStack>
              </ListItem>
            ))}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { PriorityPicker };
