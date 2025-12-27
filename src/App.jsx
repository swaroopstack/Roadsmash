import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Course from "./pages/Course";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<Course />} />
      </Routes>
    </BrowserRouter>
  );
}
