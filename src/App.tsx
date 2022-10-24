import { useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import { init } from "./Web3Client";

function App() {
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="container mx-auto pt-2">
      <Header />
    </div>
  );
}

export default App;
