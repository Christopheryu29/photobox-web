import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Box, Typography, Container } from "@mui/material";

const DownloadPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { finalImage, template } = location.state || {};
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [finalImageSrc, setFinalImageSrc] = useState<string>("");

  // Display the final image on canvas
  const displayFinalImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !finalImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = finalImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Update preview
      setFinalImageSrc(canvas.toDataURL("image/png"));
    };
  };

  useEffect(() => {
    if (finalImage) {
      displayFinalImage();
    }
  }, [finalImage]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "photobox.png";
      link.click();
    }
  };

  const handleReset = () => {
    navigate("/frame", { state: { template } });
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Your Photo is Ready!
      </Typography>

      {/* Display the final image */}
      {finalImageSrc && (
        <Box
          sx={{
            borderRadius: "8px",
            overflow: "hidden",
            border: "4px solid #ccc",
            marginBottom: "20px",
            display: "inline-block",
          }}
        >
          <img
            src={finalImageSrc}
            alt="Final Photo"
            style={{
              maxWidth: "100%",
              width: "600px",
              height: "auto",
            }}
          />
        </Box>
      )}

      {/* Hidden canvas for download functionality */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Buttons */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{ mr: 2 }}
        >
          Download Photo
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Container>
  );
};

export default DownloadPage;
