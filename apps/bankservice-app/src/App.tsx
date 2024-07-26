import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Netbanking } from "./pages/Netbanking";
import { ErrorPage } from "./pages/ErrorPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/netbanking" element={<Netbanking />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
