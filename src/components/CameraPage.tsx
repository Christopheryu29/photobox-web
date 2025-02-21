import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";

// Styled Components
const WebcamContainer = styled.div<{ mirrored: boolean; filter: string }>`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  overflow: hidden;

  video {
    width: 90%;
    border-radius: 15px;
    transform: ${(props) => (props.mirrored ? "scaleX(-1)" : "none")};
    filter: ${(props) => props.filter};
  }
`;

const CountdownOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 6rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px black;
  z-index: 2;
`;

const FlashOverlay = styled.div<{ flash: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: ${(props) => (props.flash ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 9999;
`;

const PreviewImgContainer = styled.div`
  position: relative;
  display: inline-block;
  border: 2px dashed #ffff;
  border-radius: 10px;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #ffd6e4;
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  font-size: 16px;
  font-weight: 50;
  font-family: serif;
  color: black;
  text-align: center;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: darkred;
  }
`;

const WebcamCanvas = styled.canvas`
  display: none;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 10px 0;
  flex-wrap: wrap;
`;

const CaptureButton = styled.button`
  color: black;
  background-color: white;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 20px;
  font-weight: 600;
  font-family: serif;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #ffff;

  &:hover {
    background-color: #ffd6e4;
  }

  &:disabled {
    background-color: #777;
    cursor: not-allowed;
  }
`;

const WebcamButton = styled.button`
  color: black;
  background-color: transparent;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 17px;
  font-weight: 50;
  font-family: serif;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #ffff;

  &:hover {
    background-color: #ffd6e4;
  }

  &:disabled {
    background-color: #777;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 17px;
  font-weight: 50;
  font-family: serif;
  color: black;
  background-color: transparent;
  margin: 5px;
  cursor: pointer;
  border: 2px solid #ffff;

  &:hover {
    background-color: #ffd6e4;
  }
`;

const ErrorMessage = styled.p`
  color: #ff5555;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const ImageGallery = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template || "diagonal";

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [images, setImages] = useState<(string | null)[]>(
    new Array(template === "diagonal" ? 3 : 4).fill(null)
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [flash, setFlash] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(3);
  const [filter, setFilter] = useState<string>("none");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const numberOfPhotos = template === "diagonal" ? 3 : 4;

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
      setErrorMessage("");
    } catch (error) {
      console.error("Error accessing the camera:", error);
      setErrorMessage(
        "Failed to access the camera. Please check your permissions."
      );
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  // Countdown Timer for Capture
  const startCountdown = (index: number) => {
    setCurrentIndex(index);
    let counter = timer;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter -= 1;
      setCountdown(counter);

      if (counter <= 0) {
        clearInterval(interval);
        setCountdown(null);
        triggerFlash();
        capturePhoto(index);
      }
    }, 1000);
  };

  // Capture Photo
  const capturePhoto = (index: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      if (ctx) {
        ctx.save();
        if (isMirrored) {
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);
        }
        ctx.filter = filter;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const imageSrc = canvas.toDataURL("image/jpeg");
        const newImages = [...images];
        newImages[index] = imageSrc;
        setImages(newImages);
      }
    }
  };

  // Flash Effect
  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  };

  // Delete Photo
  const handleDelete = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  // Reset Photos
  const handleReset = () => {
    setImages(new Array(numberOfPhotos).fill(null));
    startCamera();
  };

  // Navigate to Next Page
  const handleNext = () => {
    stopCamera();
    navigate("/frame", { state: { images, template } });
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <Box height="85vh" textAlign="center" mt={10}>
      <Typography variant="h4" color="primary" mb={4}>
        Take Photos ({images.filter(Boolean).length}/{numberOfPhotos})
      </Typography>

      <WebcamContainer mirrored={isMirrored} filter={filter}>
        {mediaStream ? (
          <video ref={videoRef} autoPlay muted playsInline />
        ) : (
          <ErrorMessage>{errorMessage || "Loading camera..."}</ErrorMessage>
        )}
        {countdown !== null && <CountdownOverlay>{countdown}</CountdownOverlay>}
      </WebcamContainer>

      <WebcamCanvas ref={canvasRef} />

      {/* Flash Overlay */}
      <FlashOverlay flash={flash} />

      {/* Timer Selection */}
      <Box 
        display="flex" 
        flexDirection="row" 
        gap={3}
        alignContent={"center"}
        justifyContent={"center"}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <label>Timer: </label>
          <Select
            value={timer}
            onChange={(e) => setTimer(parseInt(e.target.value))}
          >
            <option value={3}>3s</option>
            <option value={5}>5s</option>
            <option value={10}>10s</option>
          </Select>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <label>Effect: </label>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="none">None</option>
            <option value="grayscale(100%)">Black & White</option>
            <option value="sepia(100%)">Vintage</option>
            <option value="blur(5px)">Blur</option>
            <option value="invert(100%)">Invert</option>
            <option value="brightness(150%)">Bright</option>
            <option value="contrast(150%)">High Contrast</option>
            <option value="saturate(200%)">Vibrant</option>
            <option value="hue-rotate(90deg)">Retro</option>
          </Select>
        </Box>
      </Box>


      <ButtonsContainer>
        {images.some((img) => img !== null) && (
          <WebcamButton onClick={handleReset}>Reset All</WebcamButton>
        )}
        {images.some((img) => img === null) && mediaStream && (
          <CaptureButton onClick={() => startCountdown(images.indexOf(null))}>
            Capture Photo ({images.filter(Boolean).length + 1}/{numberOfPhotos})
          </CaptureButton>
        )}
        {images.every((img) => img !== null) && (
          <WebcamButton onClick={handleNext}>Next</WebcamButton>
        )}
        <WebcamButton onClick={() => setIsMirrored(!isMirrored)}>
          {isMirrored ? "Disable Mirror" : "Enable Mirror"}
        </WebcamButton>
      </ButtonsContainer>

      <ImageGallery>
        {images.map((img, index) => (
          <PreviewImgContainer
            key={index}
            onClick={() => startCountdown(index)}
          >
            {img ? (
              <>
                <PreviewImg src={img} alt={`Photo ${index + 1}`} />
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(index);
                  }}
                >
                  ✖
                </DeleteButton>
              </>
            ) : (
              <Placeholder>Capture Photo</Placeholder>
            )}
          </PreviewImgContainer>
        ))}
      </ImageGallery>
    </Box>
  );
};

export default CameraPage;
