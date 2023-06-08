import { Center, Text, Flex } from "@chakra-ui/layout";
import { MdToday } from "react-icons/md";

const DateIconText = ({ value, dateFormatter }) => {
  return (
    <Flex>
      <Center>
        <MdToday size={20} />
        <Text paddingLeft={2} fontSize="md">
          {value ? dateFormatter(value) : "Due Date"}
        </Text>
      </Center>
    </Flex>
  );
};

export { DateIconText };
