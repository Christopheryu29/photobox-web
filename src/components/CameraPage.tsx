import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  text-align: center;
  color: white;
  margin: 20px auto;
  max-width: 600px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: 600;
`;

const WebcamContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border: 3px solid #4caf50;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const WebcamVideo = styled.video`
  width: 100%;
  border-radius: 15px;
`;

const PreviewImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`;

const WebcamCanvas = styled.canvas`
  display: none;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const WebcamButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #777;
    cursor: not-allowed;
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
  const [images, setImages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  // Capture Photo
  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL("image/jpeg");
        setImages((prev) => [...prev, imageSrc]);
      }
    }
  };

  // Reset Photos
  const handleReset = () => {
    setImages([]);
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
    <Container>
      <Title>
        Take Photos ({images.length}/{numberOfPhotos})
      </Title>

      <WebcamContainer>
        {mediaStream ? (
          <WebcamVideo ref={videoRef} autoPlay muted playsInline />
        ) : (
          <ErrorMessage>{errorMessage || "Loading camera..."}</ErrorMessage>
        )}
      </WebcamContainer>

      <WebcamCanvas ref={canvasRef} />

      <ButtonsContainer>
        {images.length < numberOfPhotos && mediaStream && (
          <WebcamButton onClick={capture}>
            Capture Photo ({images.length + 1}/{numberOfPhotos})
          </WebcamButton>
        )}
        {images.length > 0 && (
          <WebcamButton onClick={handleReset}>Reset</WebcamButton>
        )}
        {images.length === numberOfPhotos && (
          <WebcamButton onClick={handleNext}>Next</WebcamButton>
        )}
      </ButtonsContainer>

      {/* Display captured images */}
      {images.length > 0 && (
        <ImageGallery>
          {images.map((img, index) => (
            <PreviewImg key={index} src={img} alt={`Photo ${index + 1}`} />
          ))}
        </ImageGallery>
      )}
    </Container>
  );
};

export default CameraPage;
