import Home from "pages/Home";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
        }}
      />
      <Home />
    </div>
  );
}

export default App;
