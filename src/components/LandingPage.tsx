// LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="95vh"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        marginBottom={3}>
      <Typography variant="h2" color="primary">
        Welcome
      </Typography>
      <Typography variant="h6" color="primary">
        Capture your moment anytime, anywhere
      </Typography>
      </Box>

      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={() => navigate("/template")}
      >
        Start
      </Button>
    </Box>
  );
};

export default LandingPage;
