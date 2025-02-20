import React from "react";
import { useLocation } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

const DownloadPage: React.FC = () => {
  const location = useLocation();
  const { images, selectedFrame } = location.state || {};

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = images[0]; // Placeholder: Combine photos into one canvas using canvas APIs.
    link.download = "photobox.png";
    link.click();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      mt={5}
    >
      <Typography variant="h4" gutterBottom>
        Your Photo is Ready!
      </Typography>
      <img
        src={images[0]}
        alt="Final Photo"
        style={{
          borderRadius: "8px",
          maxWidth: "100%",
          width: "300px",
          height: "auto",
          marginBottom: "20px",
        }}
      />
      <Button variant="contained" color="primary" onClick={handleDownload}>
        Download Photo
      </Button>
    </Box>
  );
};

export default DownloadPage;
