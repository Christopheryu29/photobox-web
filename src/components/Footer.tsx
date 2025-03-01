import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box>
      <Container maxWidth="lg" sx={{mb: 1}}>
        <Typography variant="body1" align="center" fontFamily={'serif'}>
          © 2025. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
