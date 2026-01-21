import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePoll from "./pages/CreatePoll";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-poll" element={<CreatePoll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
