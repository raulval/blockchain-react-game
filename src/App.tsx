import Home from "pages/Home";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <>
      <Toaster
        position="top-left"
        toastOptions={{
          duration: 5000,
        }}
      />
      <Home />
    </>
  );
}

export default App;
