import { useEffect } from "react";
import { useRepairEngine } from "./hooks/useRepairEngine";

function App() {
  const engine = useRepairEngine();

  useEffect(() => {
    engine.loadCode("print('hello')");

    engine.runCurrentCode().then((res) => {
      console.log("RUN:", res);
    });

    engine.startFullRepair(2).then((res) => {
      console.log("REPAIR:", res);
    });
  }, []);

  return <div>Testing Repair Engine...</div>;
}

export default App;
