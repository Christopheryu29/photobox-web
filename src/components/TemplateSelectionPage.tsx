// TemplateSelectionPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Button } from "@mui/material";

const TemplateSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectTemplate = (template: string) => {
    navigate("/camera", { state: { template } });
  };

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom>
        Choose Your Template
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={6}>
          <Box
            border={1}
            borderRadius={2}
            p={3}
            textAlign="center"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSelectTemplate("diagonal")}
          >
            <Typography>3 Pictures (Diagonal)</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            border={1}
            borderRadius={2}
            p={3}
            textAlign="center"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSelectTemplate("grid")}
          >
            <Typography>4 Pictures (2x2)</Typography>
          </Box>
        </Grid>
      </Grid>
      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate("/")}>
        Back
      </Button>
    </Box>
  );
};

export default TemplateSelectionPage;
