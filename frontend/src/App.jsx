import { Route, Routes } from "react-router-dom";
import Privacy from "./Components/privacy/Privacy";
import Home from "./Components/home/Home";
import Terms from "./Components/terms/Terms";
import Return from "./Components/return/Return";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/return" element={<Return />} />
      </Routes>
    </div>
  );
};

export default App;
