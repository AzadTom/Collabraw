import "./App.css";
import { Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/ThemeProvider/ThemeProvider";
import WhiteBoard from "./pages/WhiteBoard";
import NotFound404 from "./components/notfound/NotFound";

function App() {
  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={
            <ThemeProvider>
              <WhiteBoard />
            </ThemeProvider>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ThemeProvider>
              <WhiteBoard />
            </ThemeProvider>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </main>
  );
}

export default App;
