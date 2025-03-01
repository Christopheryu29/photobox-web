import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import LandingPage from "./components/LandingPage";
import TemplateSelectionPage from "./components/TemplateSelectionPage";
import CameraPage from "./components/CameraPage";
import FrameSelectionPage from "./components/FrameSelectionPage";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/next";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Analytics />
      <Container maxWidth="md" sx={{ minHeight: "100vh", px: 3 }}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/template" element={<TemplateSelectionPage />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/frame" element={<FrameSelectionPage />} />
            {/* Ensure Navigate is correctly used if needed */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default App;
