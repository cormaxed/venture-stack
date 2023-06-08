import { Flex } from "@chakra-ui/layout";
import { DateIconText } from "./dateIconText";

const DueDate = ({
  dueDate,
  formatDate,
  paddingLeft = 3,
  paddingRight = 3,
  button = true,
}) => {
  return (
    <Flex
      border={button ? "2px solid" : "none"}
      borderColor={button ? "gray.300" : "none"}
      borderRadius={button ? 6 : 0}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingTop={1}
      paddingBottom={1}
      _hover={{ backgroundColor: button ? "gray.200" : "none" }}
    >
      <DateIconText value={dueDate} dateFormatter={formatDate} />
    </Flex>
  );
};

export { DueDate };
