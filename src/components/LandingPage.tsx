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
        marginBottom={3}
      >
        <Typography variant="h2" color="primary" align="center">
          Welcome
        </Typography>
        <Typography variant="h6" color="primary" align="center">
          Capture your moment anytime, anywhere
        </Typography>
        <Typography
          variant="subtitle1"
          color="primary"
          fontFamily={"serif"}
          align="center"
        >
          Your photo will be visible only to you, and we do not collect any of
          your data
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
