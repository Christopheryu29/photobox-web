"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  Typography,
  Container,
  useMediaQuery,
} from "@mui/material";

const frameColors = [
  "#ffffff",
  "#000000",
  "#4d0000",
  "#0e1b45",
  "#1e3d1b",
  "#fce6f2",
];

const textures3 = [
  "./texture/3/1.png",
  "./texture/3/2.png",
  "./texture/3/3.png",
  "./texture/3/4.png",
  "./texture/3/5.png",
  "./texture/3/6.png",
  "./texture/3/7.png",
];

const textures4 = [
  "./texture/4/1.png",
  "./texture/4/2.png",
  "./texture/4/3.png",
  "./texture/4/4.png",
  "./texture/4/5.png",
  "./texture/4/6.png",
  "./texture/4/7.png",
];

const FrameSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { images, template } = location.state || {};
  const [selectedFrameColor, setSelectedFrameColor] =
    useState<string>("#ffffff");
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
  const [frameWidth] = useState<number>(15); // Smaller frame width for mobile
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isMobile = useMediaQuery("(max-width: 768px)"); // Mobile breakpoint
  const pixelRatio = isMobile ? 2 : Math.max(window.devicePixelRatio || 1, 2); // Optimize pixel ratio for mobile
  const currentDate = new Date().toLocaleDateString(); // Get current date

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !images || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true; // Enable image smoothing
    ctx.imageSmoothingQuality = "high"; // Use high-quality smoothing

    const gap = 10; // Smaller gap for mobile
    const cols = images.length === 4 ? 2 : 1;
    const rows = images.length === 4 ? 2 : 3;

    // Define photoWidth based on device type and number of images
    const photoWidth = isMobile ? (images.length === 4 ? 150 : 260) : (images.length === 4 ? 200 : 320);

    // Define photoHeight based on device type and number of images
    const photoHeight = isMobile ? (images.length === 4 ? 210 : 140) : (images.length === 4 ? 260 : 200);

    // Additional space for "Photobox" and date
    const textHeight = 80;
    const canvasWidth = cols * photoWidth + (cols - 1) * gap + 2 * frameWidth;
    const canvasHeight =
      rows * photoHeight + (rows - 1) * gap + 2 * frameWidth + textHeight;

    // Set canvas size for high-resolution rendering
    canvas.width = canvasWidth * pixelRatio;
    canvas.height = canvasHeight * pixelRatio;

    // Scale canvas to display smaller visually but keep high resolution
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(pixelRatio, pixelRatio);

    if (selectedTexture) {
      const img = new Image();
      img.src = selectedTexture;
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          canvas.width / pixelRatio,
          canvas.height / pixelRatio
        );
        drawImages(ctx, photoWidth, photoHeight, gap, cols, rows, textHeight);
      };
    } else {
      ctx.fillStyle = selectedFrameColor;
      ctx.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
      drawImages(ctx, photoWidth, photoHeight, gap, cols, rows, textHeight);
    }
  };

  const drawImages = (
    ctx: CanvasRenderingContext2D,
    photoWidth: number,
    photoHeight: number,
    gap: number,
    cols: number,
    rows: number,
    textHeight: number
  ) => {
    images.forEach((imgSrc: string, index: number) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = frameWidth + col * (photoWidth + gap);
        const y = frameWidth + row * (photoHeight + gap);

        const scaleX = img.width / photoWidth;
        const scaleY = img.height / photoHeight;
        let cropWidth, cropHeight, cropX, cropY;

        if (scaleX > scaleY) {
          cropHeight = img.height;
          cropWidth = cropHeight * (photoWidth / photoHeight);
          cropX = (img.width - cropWidth) / 2;
          cropY = 0;
        } else {
          cropWidth = img.width;
          cropHeight = cropWidth * (photoHeight / photoWidth);
          cropY = (img.height - cropHeight) / 2;
          cropX = 0;
        }

        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          x,
          y,
          photoWidth,
          photoHeight
        );
      };
    });
  };

  useEffect(() => {
    generatePreview();
  }, [selectedFrameColor, selectedTexture, images]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "photobooth.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", mt: isMobile ? 5 : 10, height: "110vh",  minHeight:"fit-content"}}>
      <Typography variant={isMobile ? "h5" : "h4"}>
        Choose Your Frame
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 3,
          justifyContent: "center",
          alignItems: "center",
          mt: 5,
          mb: 5,
        }}
      >
        {/* Left Side: Canvas */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center', // Center horizontally
          alignItems: 'center',     // Center vertically (if desired)
          width: isMobile ? '100%' : 'auto'
        }}>
          <canvas
            ref={canvasRef}
          />
        </Box>

        {/* Right Side: Options */}
        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Frame Color Options */}
          <Typography variant="h6">Frame Color</Typography>
          <Grid
            container
            spacing={1}
            sx={{ mt: 1, mb: 2, justifyContent: "center" }}
          >
            {frameColors.map((color) => (
              <Grid item key={color}>
                <Box
                  sx={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    backgroundColor: color,
                    border:
                      selectedFrameColor === color
                        ? "3px solid black"
                        : "1px solid gray",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedFrameColor(color);
                    setSelectedTexture(null);
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Frame Texture Options */}
          <Typography variant="h6">Background Texture</Typography>
          <Grid
            container
            spacing={1}
            sx={{ mt: 1, mb: 2, justifyContent: "center" }}
          >
            {(images.length === 3 ? textures3 : textures4).map(
              (texture: string) => (
                <Grid item key={texture}>
                  <Box
                    sx={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      backgroundImage: `url(${texture})`,
                      backgroundSize: "cover",
                      border:
                        selectedTexture === texture
                          ? "3px solid black"
                          : "1px solid gray",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedTexture(texture)}
                  />
                </Grid>
              )
            )}
          </Grid>

          {/* Buttons */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleDownload}
              sx={{
                boxShadow: "none",
                textTransform: "none",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default FrameSelectionPage;
