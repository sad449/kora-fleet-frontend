import { useEffect, useState } from "react";
import api from "./models/api";

function App() {
  const [status, setStatus] = useState("checking...");
  const [database, setDatabase] = useState("checking...");

  useEffect(() => {
    api
      .get("/health")
      .then((response) => {
        setStatus(response.data.status);
        setDatabase(response.data.database);
      })
  .catch(() => {
  setStatus("backend unreachable");
        setDatabase("unknown");
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Kora Fleet</h1>
      <p>API status: {status}</p>
      <p>Database: {database}</p>
    </div>
  );
}

export default App;