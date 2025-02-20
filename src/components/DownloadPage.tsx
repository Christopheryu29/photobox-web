import React from "react";
import { useLocation } from "react-router-dom";
import { Button, VStack, Text, Image } from "@chakra-ui/react";

const DownloadPage: React.FC = () => {
  const location = useLocation();
  const { images, selectedFrame } = location.state || {};

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = images[0]; // Placeholder: You should combine photos into one canvas using canvas APIs.
    link.download = "photobox.png";
    link.click();
  };

  return (
    <VStack>
      <Text fontSize="2xl" color="white">
        Your Photo is Ready!
      </Text>
      <Image src={images[0]} alt="Final Photo" borderRadius="md" />
      <Button colorScheme="blue" onClick={handleDownload}>
        Download Photo
      </Button>
    </VStack>
  );
};

export default DownloadPage;
