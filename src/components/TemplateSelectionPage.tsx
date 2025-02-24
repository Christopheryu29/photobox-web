import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Button, useMediaQuery } from "@mui/material";

const TemplateSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSelectTemplate = (template: string) => {
    navigate("/camera", { state: { template } });
  };

  return (
    <Box
      height="85vh"
      textAlign="center"
      mt={isMobile ? 5 : 10}
      px={isMobile ? 2 : 0}
    >
      <Typography variant={isMobile ? "h5" : "h4"} color="primary" mb={4}>
        Choose Your Template
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* 3 Pictures (Diagonal) */}
        <Grid item xs={12} sm={6}>
          <Box
            border={1}
            borderRadius={2}
            p={2}
            textAlign="center"
            sx={{
              cursor: "pointer",
              minHeight: "180px",
              transition: "all 0.3s",
              "&:hover": { borderColor: "primary.main", boxShadow: 2 },
            }}
            onClick={() => handleSelectTemplate("diagonal")}
          >
            <img
              src="/diagonal.png"
              alt="3 Pictures (Diagonal)"
              style={{ width: isMobile ? "50%" : "30%", borderRadius: "8px" }}
            />
            <Typography
              color="primary"
              mt={2}
              fontSize={isMobile ? "16px" : "18px"}
            >
              3 Pictures (Diagonal)
            </Typography>
          </Box>
        </Grid>

        {/* 4 Pictures (2x2) */}
        <Grid item xs={12} sm={6}>
          <Box
            border={1}
            borderRadius={2}
            p={2}
            textAlign="center"
            sx={{
              cursor: "pointer",
              minHeight: "180px",
              transition: "all 0.3s",
              "&:hover": { borderColor: "primary.main", boxShadow: 2 },
            }}
            onClick={() => handleSelectTemplate("grid")}
          >
            <img
              src="/grid.png"
              alt="4 Pictures (2x2)"
              style={{ width: isMobile ? "60%" : "45%", borderRadius: "8px" }}
            />
            <Typography
              color="primary"
              mt={2}
              fontSize={isMobile ? "16px" : "18px"}
            >
              4 Pictures (2x2)
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Button
        variant="outlined"
        sx={{
          mt: 4,
          width: isMobile ? "80%" : "auto",
          fontSize: isMobile ? "14px" : "16px",
        }}
        onClick={() => navigate("/")}
      >
        Back
      </Button>
    </Box>
  );
};

export default TemplateSelectionPage;
