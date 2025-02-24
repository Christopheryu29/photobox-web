import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  Typography,
  Container,
} from "@mui/material";

const frameColors = ["#ffffff", "#000000", "#4d0000", "#0e1b45", "#fce6f2"];
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
  const [frameWidth, setFrameWidth] = useState<number>(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !images || images.length === 0) return;
  
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const gap = 10;
    let cols = images.length === 4 ? 2 : 1;
    let rows = images.length === 4 ? 2 : 3;
    let photoWidth = images.length === 4 ? 200 : 260;
    let photoHeight = images.length === 4 ? 260 : 160;
    let canvasWidth = images.length === 4 ? 450 : 300;
    let canvasHeight = 650;
  
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  
    if (selectedTexture) {
      const img = new Image();
      img.src = selectedTexture;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawImages(ctx, photoWidth, photoHeight, gap, cols, rows);
      };
    } else {
      ctx.fillStyle = selectedFrameColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawImages(ctx, photoWidth, photoHeight, gap, cols, rows);
    }
  };
  
  const drawImages = (
    ctx: CanvasRenderingContext2D,
    photoWidth: number,
    photoHeight: number,
    gap: number,
    cols: number,
    rows: number
  ) => {
    images.forEach((imgSrc: string, index: number) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = frameWidth + col * (photoWidth + gap);
        const y = frameWidth + row * (photoHeight + gap);
  
        // Determine the scale and position to crop the image
        const scaleX = img.width / photoWidth;
        const scaleY = img.height / photoHeight;
        let cropWidth, cropHeight, cropX, cropY;
  
        if (scaleX > scaleY) {
          // Image is wider than needed
          cropHeight = img.height;
          cropWidth = cropHeight * (photoWidth / photoHeight);
          cropX = (img.width - cropWidth) / 2;
          cropY = 0;
        } else {
          // Image is taller than needed
          cropWidth = img.width;
          cropHeight = cropWidth * (photoHeight / photoWidth);
          cropY = (img.height - cropHeight) / 2;
          cropX = 0;
        }
  
        // Drawing the cropped image to the canvas
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, photoWidth, photoHeight); // Define the clipping path
        ctx.clip(); // Apply clipping to ensure only this part of the canvas shows the image
  
        // Draw the image part on canvas
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
  
        ctx.restore();
      };
    });
  };
  
  useEffect(() => {
    generatePreview();
  }, [
    selectedFrameColor,
    selectedTexture,
    frameWidth,
    images,
  ]);

  const handleNext = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const finalImage = canvas.toDataURL("image/jpeg");
      navigate("/download", { state: { finalImage, template } });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Choose Your Frame
      </Typography>
  
      {/* Flexbox Layout for Left (Canvas) and Right (Options) */}
      <Box
        sx={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          alignItems: "flex-start",
          mt: 3,
          mb: 5,
        }}
      >
        {/* Left Side: Canvas */}
        <Box
        sx={{
          justifyContent:"center",
          alignItems: "center",
        }}
        >
        <canvas ref={canvasRef} />
        </Box>
  
        {/* Right Side: Options */}
        <Box sx={{ width: "50%", textAlign: "left", display:"flex", flexDirection:"column", 
          justifyContent:"center", alignItems: "center", margin:"auto"}}>
          
          {/* Frame Color Options */}
          <Typography variant="h6">
            Select Frame Color:
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1, mb: 2, justifyContent:"center", alignItems: "center"}}>
            {frameColors.map((color) => (
              <Grid item key={color}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: color,
                    border:
                      selectedFrameColor === color
                        ? "3px solid black"
                        : "1px solid gray",
                    cursor: "pointer",
                  }}
                  onClick={() => {setSelectedFrameColor(color);
                    setSelectedTexture(null);
                  }}
                />
              </Grid>
            ))}
          </Grid>
  
          {/* Frame Texture Options */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Select Background Texture:
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1, mb: 2, justifyContent:"center", alignItems: "center"}}>
          {(images.length === 3 ? textures3 : textures4).map((texture: string) => (
            <Grid item key={texture}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundImage: `url(${texture})`,
                backgroundSize: "cover",
                border:
                  selectedTexture === texture
                    ? "3px solid black"
                    : "1px solid gray",
                cursor: "pointer",
              }} onClick={() => setSelectedTexture(texture)} />
            </Grid>
          ))}
          </Grid>

          {/* Buttons */}
          <Box sx={{ mt: 3, justifyContent:"center", alignItems: "center"}}>
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={handleNext}
              sx={{boxShadow: "none", textTransform: "none"}}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
  
};

export default FrameSelectionPage;
