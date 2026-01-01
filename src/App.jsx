import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Course from "./pages/Course";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing + Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Course page */}
        <Route path="/course/:id" element={<Course />} />
      </Routes>
    </BrowserRouter>
  );
}
