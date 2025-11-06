import { useEffect, useState } from "react";
import API from "../api/api";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/")
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Backend not responding"));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Home Page</h1>
      <p className="mt-2 text-gray-600">Testing backend connection...</p>

      <div className="mt-4 p-3 bg-white shadow rounded">
        {message || "Loading..."}
      </div>
    </div>
  );
}
