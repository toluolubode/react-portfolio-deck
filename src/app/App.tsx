import { BrowserRouter as Router, Routes, Route } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import PresentationPage from "./pages/PresentationPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<PresentationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
