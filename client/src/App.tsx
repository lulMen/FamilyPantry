import { useEffect } from "react";
import axios from "axios";

import "./App.css";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api");
        console.log("response: ", response);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return null;
}

export default App;
