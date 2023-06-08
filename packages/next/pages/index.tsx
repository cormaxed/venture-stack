import { Box } from "@chakra-ui/react";
import TodoLayout from "../components/todoLayout";

const Home = () => {
  return (
    <Box height="calc(100vh - 50px)">
      <TodoLayout />
    </Box>
  );
};

export default Home;
