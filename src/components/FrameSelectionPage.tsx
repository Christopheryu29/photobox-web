import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, Box, Button, Text, VStack } from "@chakra-ui/react";

const FrameSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { images, template } = location.state || {};
  const [selectedFrame, setSelectedFrame] = useState<string>("");

  const handleFrameSelect = (frame: string) => {
    setSelectedFrame(frame);
  };

  const handleNext = () => {
    navigate("/download", { state: { images, template, selectedFrame } });
  };

  return (
    <VStack>
      <Text fontSize="2xl" color="white">
        Choose Your Frame
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box
          border="1px solid white"
          p={4}
          borderRadius="md"
          onClick={() => handleFrameSelect("frame1")}
        >
          <Text color="white">Frame 1</Text>
        </Box>
        <Box
          border="1px solid white"
          p={4}
          borderRadius="md"
          onClick={() => handleFrameSelect("frame2")}
        >
          <Text color="white">Frame 2</Text>
        </Box>
      </Grid>
      <Button colorScheme="blue" onClick={handleNext}>
        Next
      </Button>
    </VStack>
  );
};

export default FrameSelectionPage;
