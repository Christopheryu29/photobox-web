import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Text, Button, VStack } from "@chakra-ui/react";

const TemplateSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectTemplate = (template: string) => {
    navigate("/camera", { state: { template } });
  };

  return (
    <VStack mt={10}>
      <Text fontSize="2xl" color="white">
        Choose Your Template
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box
          border="1px solid white"
          p={4}
          borderRadius="md"
          onClick={() => handleSelectTemplate("diagonal")}
        >
          <Text color="white">3 Pictures (Diagonal)</Text>
        </Box>
        <Box
          border="1px solid white"
          p={4}
          borderRadius="md"
          onClick={() => handleSelectTemplate("grid")}
        >
          <Text color="white">4 Pictures (2x2)</Text>
        </Box>
      </Grid>
      <Button colorScheme="blue" onClick={() => navigate("/")}>
        Back
      </Button>
    </VStack>
  );
};

export default TemplateSelectionPage;
