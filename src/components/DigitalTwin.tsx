import { useState, useEffect } from "react";

interface HoneypotLog {
  id?: number;
  ip?: string;
  payload?: any;
  time?: string;
}

export default function DigitalTwin() {

  const [logs, setLogs] = useState<HoneypotLog[]>([]);

  // Fetch honeypot logs every 3 seconds
  useEffect(() => {

    const interval = setInterval(async () => {

      try {

        const res = await fetch("http://localhost:5001/logs");
        const data = await res.json();

        setLogs(data);

      } catch (err) {

        console.error("Failed to fetch honeypot logs", err);

      }

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  // Simulate attack request to honeypot
  const simulateAttack = async (type: string) => {

    try {

      await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          attack: type,
          endpoint: "/test-endpoint"
        })
      });

      console.log("Simulated attack:", type);

    } catch (error) {

      console.error("Simulation failed", error);

    }

  };

  return (

    <div style={{ border: "1px solid gray", padding: "20px" }}>

      <h2>Digital Twin Honeypot</h2>

      <p>
        This virtual environment traps attackers and records their activity safely.
      </p>

      <div style={{ marginBottom: "10px" }}>

        <button onClick={() => simulateAttack("SQL Injection")}>
          Simulate SQL Injection
        </button>

        <button onClick={() => simulateAttack("Brute Force Login")}>
          Simulate Brute Force
        </button>

        <button onClick={() => simulateAttack("DDoS Attack")}>
          Simulate DDoS
        </button>

      </div>

      <h3>Captured Attacker Logs</h3>

      {logs.length === 0 ? (
        <p>No attackers detected yet.</p>
      ) : (
        <ul>

          {logs.map((log, index) => (
            <li key={index}>

              <strong>IP:</strong> {log.ip || "Unknown"} <br />
              <strong>Attack:</strong> {log.payload?.attack || "Unknown"} <br />
              <strong>Time:</strong> {log.time}

              <hr />

            </li>
          ))}

        </ul>
      )}

    </div>

  );

}