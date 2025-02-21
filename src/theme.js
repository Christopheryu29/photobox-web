import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'DM Serif Display',
      'gloock',
      'sans-serif'
    ].join(','),
  },

  palette: {
    primary: {
      main: '#1a1919',  // Example primary color
    },
    secondary: {
      main: '#19857b',  // Example secondary color
    },
    customColor: {  // Your custom color name
      main: '#FF5733',  // Custom color
      contrastText: '#ffffff',  // Text color for contrast (optional)
    }
  },
});

export default theme;
