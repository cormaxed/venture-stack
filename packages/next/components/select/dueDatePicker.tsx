import {
  Box,
  Center,
  Divider,
  Grid,
  GridItem,
  HStack,
  List,
  ListItem,
  Text,
} from "@chakra-ui/layout";
import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { MdToday, MdLightMode, MdWeekend, MdNextWeek } from "react-icons/md";
import { DueDate } from "./dueDate";
import { formatDate, nextWeek, tommorrow, weekend } from "../../lib/dates";

const DateListItem = ({ icon, text, date, color, onClick }) => {
  return (
    <ListItem
      _hover={{ backgroundColor: "gray.200" }}
      fontSize="lg"
      onClick={onClick}
    >
      <Grid templateColumns="repeat(8, 1fr)" gap={6}>
        <GridItem colSpan={5}>
          <Box>
            <HStack>
              <Center>
                <Icon as={icon} color={color} boxSize="5" />
                <Text paddingLeft={2}>{text}</Text>
              </Center>
            </HStack>
          </Box>
        </GridItem>
        <GridItem colSpan={3}>
          <Box>
            <Text>{formatDate(date)}</Text>
          </Box>
        </GridItem>
      </Grid>
    </ListItem>
  );
};

const dateShortcuts = [
  { icon: MdToday, color: "green.500", text: "Today", date: new Date() },
  {
    icon: MdLightMode,
    color: "yellow.500",
    text: "Tommorrow",
    date: tommorrow(new Date()),
  },
  {
    icon: MdWeekend,
    color: "blue.500",
    text: "This Weekend",
    date: weekend(new Date()),
  },
  {
    icon: MdNextWeek,
    color: "purple.500",
    text: "Next Week",
    date: nextWeek(new Date()),
  },
];

const DueDatePicker = ({ dueDate, setDueDate }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleDateChange = (date: Date) => {
    setDueDate(date);
    onClose();
  };

  return (
    <Popover
      placement="bottom"
      onClose={onClose}
      onOpen={onOpen}
      isOpen={isOpen}
    >
      <PopoverTrigger>
        <Box>
          <DueDate dueDate={dueDate} formatDate={formatDate} />
        </Box>
      </PopoverTrigger>
      <PopoverContent width="280px">
        <PopoverArrow />
        <PopoverBody>
          <List>
            <ListItem>
              <Box fontSize="lg">
                <input
                  type="date"
                  value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setDueDate(new Date(e.target.value))}
                />
              </Box>
              <Divider paddingTop={2} paddingBottom={2} />
            </ListItem>
            {dateShortcuts.map((shortcut) => (
              <DateListItem
                key={shortcut.text}
                onClick={() => handleDateChange(shortcut.date)}
                {...shortcut}
              />
            ))}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { DueDatePicker };
