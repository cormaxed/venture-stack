import { Box, Flex, Spacer, Center } from "@chakra-ui/layout";
import { IconButton, Avatar } from "@chakra-ui/react";
import { useStoreState } from "easy-peasy";
import { MdMenu, MdHome, MdAdd, MdOutlineNotifications } from "react-icons/md";

const Header = ({ onOpenTaskForm }) => {
  const profile = useStoreState((state: any) => state.profile);

  return (
    <Box bgColor="red.500" height="50px" paddingTop={1} paddingBottom={1}>
      <Flex>
        <IconButton aria-label="" background="transparent" marginLeft={4}>
          <MdMenu size="30px" color="white" />
        </IconButton>
        <IconButton aria-label="" background="transparent" marginLeft={3}>
          <MdHome size="30px" color="white" />
        </IconButton>
        <Spacer />
        <Center>
          <IconButton
            aria-label=""
            background="transparent"
            marginRight={4}
            onClick={onOpenTaskForm}
          >
            <MdAdd size="30px" color="white" />
          </IconButton>
          <IconButton aria-label="" background="transparent" marginRight={4}>
            <MdOutlineNotifications size="30px" color="white" />
          </IconButton>
          <Avatar name={profile.email} size="sm" marginRight={2} />
        </Center>
      </Flex>
    </Box>
  );
};

export { Header };
