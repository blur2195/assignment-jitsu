import { Route, Routes } from "react-router-dom";
import Shipments from "./features/shipments";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Shipments />} />
    </Routes>
  );
}

export default App;
