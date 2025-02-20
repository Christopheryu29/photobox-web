import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Text, Center } from "@chakra-ui/react";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Center h="100vh" flexDirection="column">
      <Text fontSize="4xl" mb={6} color="white">
        Welcome to Photobox
      </Text>
      <Button
        colorScheme="blue"
        size="lg"
        onClick={() => navigate("/template")}
      >
        Start
      </Button>
    </Center>
  );
};

export default LandingPage;
