import React, { useState, useEffect } from "react";

function App() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT saved during login
        if (!token) throw new Error("No token found, login first.");

        const res = await fetch("http://localhost:4000/api/slot/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Backend error");
        }

        const data = await res.json();
        if (!Array.isArray(data))
          throw new Error("Invalid response from server");

        setSlots(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  if (loading) return <div>Loading slots...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Slots</h1>
      {slots.length === 0 ? (
        <p>No slots found.</p>
      ) : (
        <ul>
          {slots.map((slot) => (
            <li key={slot.id}>
              <strong>{slot.title}</strong> |{" "}
              {new Date(slot.startTime).toLocaleString()} -{" "}
              {new Date(slot.endTime).toLocaleString()} | Status: {slot.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
