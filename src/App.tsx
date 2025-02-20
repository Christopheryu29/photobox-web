import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Provider } from "./components/ui/Provider";
import LandingPage from "./components/LandingPage";
import TemplateSelectionPage from "./components/TemplateSelectionPage";
import CameraPage from "./components/CameraPage";
import FrameSelectionPage from "./components/FrameSelectionPage";
import DownloadPage from "./components/DownloadPage";

const App: React.FC = () => {
  return (
    <Provider>
      <Box bg="#303030" minH="100vh" color="white" p={4}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/template" element={<TemplateSelectionPage />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/frame" element={<FrameSelectionPage />} />
            <Route path="/download" element={<DownloadPage />} />
          </Routes>
        </Router>
      </Box>
    </Provider>
  );
};

export default App;
