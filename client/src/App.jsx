import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/index.jsx";
import Details from "./pages/details.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
