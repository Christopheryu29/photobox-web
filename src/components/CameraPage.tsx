import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  VStack,
  Text,
  HStack,
  Box,
  Image,
  Flex,
  Toast,
} from "@chakra-ui/react";

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template || "diagonal";
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Number of photos required based on the template
  const numberOfPhotos = template === "diagonal" ? 3 : 4;

  // Start camera stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsCameraReady(true);
          };
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture photo
  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 300;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL("image/jpeg");
        setImages((prev) => [...prev, imageSrc]);
      }
    }
  };

  // Navigate to frame page
  const handleNext = () => {
    navigate("/frame", { state: { images, template } });
  };

  // Reset photos
  const handleReset = () => {
    setImages([]);
  };

  return (
    <VStack>
      <Text fontSize="2xl" color="white">
        Take Photos ({images.length}/{numberOfPhotos})
      </Text>

      <Flex
        justifyContent="center"
        alignItems="center"
        borderRadius="md"
        overflow="hidden"
        border="2px solid white"
        bg="black"
      >
        {isCameraReady ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "400px", height: "300px" }}
          />
        ) : (
          <Text color="white">Loading camera...</Text>
        )}
      </Flex>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <HStack>
        {images.length < numberOfPhotos && (
          <Button colorScheme="green" onClick={capture}>
            Capture Photo ({images.length + 1}/{numberOfPhotos})
          </Button>
        )}
        {images.length > 0 && (
          <Button colorScheme="red" onClick={handleReset}>
            Reset
          </Button>
        )}
      </HStack>

      {images.length === numberOfPhotos && (
        <Button colorScheme="blue" onClick={handleNext}>
          Next
        </Button>
      )}

      {/* Display captured images */}
      {images.length > 0 && (
        <HStack mt={4}>
          {images.map((img, index) => (
            <Box key={index} border="1px solid white" borderRadius="md" p={1}>
              <Image
                src={img}
                alt={`Photo ${index + 1}`}
                boxSize="100px"
                borderRadius="md"
                objectFit="cover"
              />
            </Box>
          ))}
        </HStack>
      )}
    </VStack>
  );
};

export default CameraPage;
