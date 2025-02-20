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
      height="100vh"
    >
      <Typography variant="h2" gutterBottom>
        Welcome to Photobox
      </Typography>
      <Button
        variant="contained"
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
