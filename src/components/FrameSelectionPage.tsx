import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  Typography,
  Container,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const frameColors = ["#ffffff", "#000000", "#ff6347", "#00bfff", "#32cd32"];
const textures = [
  "/textures/wood.jpg",
  "/textures/marble.jpg",
  "/textures/gradient.jpg",
];

const FrameSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { images, template } = location.state || {};
  const [selectedFrameColor, setSelectedFrameColor] =
    useState<string>("#ffffff");
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
  const [uploadedTexture, setUploadedTexture] = useState<string | null>(null);
  const [frameWidth, setFrameWidth] = useState<number>(20);
  const [borderRadius, setBorderRadius] = useState<number>(10);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical"
  );
  const [borderStyle, setBorderStyle] = useState<"solid" | "dashed" | "dotted">(
    "solid"
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas || !images || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const photoWidth = 320;
    const photoHeight = 180;
    const gap = 10;

    const cols = orientation === "horizontal" ? images.length : 1;
    const rows = orientation === "vertical" ? images.length : 1;

    const canvasWidth = cols * photoWidth + (cols - 1) * gap + frameWidth * 2;
    const canvasHeight = rows * photoHeight + (rows - 1) * gap + frameWidth * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw frame background or texture
    const textureSrc = uploadedTexture || selectedTexture;
    if (textureSrc) {
      const img = new Image();
      img.src = textureSrc;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawImages(ctx, photoWidth, photoHeight, gap);
      };
    } else {
      ctx.fillStyle = selectedFrameColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawImages(ctx, photoWidth, photoHeight, gap);
    }
  };

  const drawImages = (
    ctx: CanvasRenderingContext2D,
    photoWidth: number,
    photoHeight: number,
    gap: number
  ) => {
    images.forEach((imgSrc: string, index: number) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const col = orientation === "horizontal" ? index : 0;
        const row = orientation === "vertical" ? index : 0;
        const x = frameWidth + col * (photoWidth + gap);
        const y = frameWidth + row * (photoHeight + gap);

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, photoWidth, photoHeight, borderRadius);
        ctx.clip();
        ctx.drawImage(img, x, y, photoWidth, photoHeight);
        ctx.restore();
      };
    });
  };

  useEffect(() => {
    generatePreview();
  }, [
    selectedFrameColor,
    selectedTexture,
    uploadedTexture,
    frameWidth,
    borderRadius,
    orientation,
    borderStyle,
    images,
  ]);

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedTexture(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const finalImage = canvas.toDataURL("image/jpeg");
      navigate("/download", { state: { finalImage, template } });
    }
  };

  const handleReset = () => {
    setSelectedFrameColor("#ffffff");
    setSelectedTexture(null);
    setUploadedTexture(null);
    setFrameWidth(20);
    setBorderRadius(10);
    setOrientation("vertical");
    setBorderStyle("solid");
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Choose Your Frame
      </Typography>

      <Box
        sx={{
          border: `${frameWidth}px ${borderStyle} ${selectedFrameColor}`,
          borderRadius: borderRadius,
          p: 2,
          mt: 3,
          display: "inline-block",
          overflow: "hidden",
        }}
      >
        <canvas ref={canvasRef} />
      </Box>

      {/* Orientation Selection */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Orientation:
      </Typography>
      <ToggleButtonGroup
        value={orientation}
        exclusive
        onChange={(e, value) => setOrientation(value)}
        sx={{ mt: 1 }}
      >
        <ToggleButton value="vertical">Vertical</ToggleButton>
        <ToggleButton value="horizontal">Horizontal</ToggleButton>
      </ToggleButtonGroup>

      {/* Frame Color Options */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Select Frame Color:
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
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
              onClick={() => setSelectedFrameColor(color)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Frame Texture Options */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Select Background Texture:
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        {textures.map((texture) => (
          <Grid item key={texture}>
            <Box
              sx={{
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
              }}
              onClick={() => {
                setSelectedTexture(texture);
                setUploadedTexture(null);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Upload Custom Texture */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Upload Your Texture:
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: 2 }}
      >
        Upload
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleTextureUpload}
        />
      </Button>

      {/* Frame Thickness Slider */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Adjust Frame Thickness:
      </Typography>
      <Slider
        value={frameWidth}
        onChange={(e, value) => setFrameWidth(value as number)}
        min={5}
        max={50}
        step={1}
        valueLabelDisplay="auto"
        sx={{ width: "300px", margin: "auto" }}
      />

      {/* Frame Border Radius Slider */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Adjust Corner Radius:
      </Typography>
      <Slider
        value={borderRadius}
        onChange={(e, value) => setBorderRadius(value as number)}
        min={0}
        max={50}
        step={1}
        valueLabelDisplay="auto"
        sx={{ width: "300px", margin: "auto" }}
      />

      {/* Frame Border Style */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        Select Border Style:
      </Typography>
      <ToggleButtonGroup
        value={borderStyle}
        exclusive
        onChange={(e, value) => setBorderStyle(value)}
        sx={{ mt: 1 }}
      >
        <ToggleButton value="solid">Solid</ToggleButton>
        <ToggleButton value="dashed">Dashed</ToggleButton>
        <ToggleButton value="dotted">Dotted</ToggleButton>
      </ToggleButtonGroup>

      {/* Buttons */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ mr: 2 }}
        >
          Next
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Container>
  );
};

export default FrameSelectionPage;
