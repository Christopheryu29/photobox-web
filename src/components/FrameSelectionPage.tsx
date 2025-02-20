import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, Box, Button, Typography, Container } from "@mui/material";

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
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Choose Your Frame
      </Typography>
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
        {["frame1", "frame2"].map((frame) => (
          <Grid item xs={6} key={frame}>
            <Box
              sx={{
                border: "2px solid",
                borderColor: selectedFrame === frame ? "primary.main" : "white",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={() => handleFrameSelect(frame)}
            >
              <Typography variant="body1">
                {frame === "frame1" ? "Frame 1" : "Frame 2"}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        sx={{ mt: 3 }}
        disabled={!selectedFrame}
      >
        Next
      </Button>
    </Container>
  );
};

export default FrameSelectionPage;
