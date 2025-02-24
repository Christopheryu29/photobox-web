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
    <Box height="85vh" textAlign="center" mt={10}>
      <Typography variant="h4" color="primary" mb={4}>
        Choose Your Template
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* 3 Pictures (Diagonal) */}
        <Grid item xs={6}>
          <Box
            border={1}
            borderRadius={2}
            p={2}
            textAlign="center"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSelectTemplate("diagonal")}
          >
            <img 
              src="/diagonal.png" 
              alt="3 Pictures (Diagonal)" 
              style={{ width: "30%", height: "100%", borderRadius: "5px" }} 
            />
            <Typography color="primary" mt={2}>
              3 Pictures (Diagonal)
            </Typography>
          </Box>
        </Grid>

        {/* 4 Pictures (2x2) */}
        <Grid item xs={6}>
          <Box
            border={1}
            borderRadius={2}
            p={2}
            textAlign="center"
            sx={{ cursor: "pointer" }}
            onClick={() => handleSelectTemplate("grid")}
          >
            <img 
              src="/grid.png" 
              alt="4 Pictures (2x2)" 
              style={{ width: "45%", height: "100%", borderRadius: "5px" }} 
            />
            <Typography color="primary" mt={2}>
              4 Pictures (2x2)
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Button variant="outlined" sx={{ mt: 4 }} onClick={() => navigate("/")}>
        Back
      </Button>
    </Box>
  );
};

export default TemplateSelectionPage;
