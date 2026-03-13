import { useState } from "react";

export default function LinkScanner() {

  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  const suspiciousWords = [
    "login",
    "secure",
    "bank",
    "verify",
    "account",
    "update"
  ];

  const checkURL = () => {

    let risk = 0;

    suspiciousWords.forEach((word) => {
      if (url.includes(word)) risk += 20;
    });

    if (url.includes(".ru") || url.includes(".tk") || url.includes(".xyz")) {
      risk += 30;
    }

    if (risk > 60) {
      setResult("⚠ High Risk Phishing Website");
    } else if (risk > 30) {
      setResult("⚠ Suspicious Website");
    } else {
      setResult("✅ Safe Website");
    }

  };

  return (
    <div style={{ padding: "20px", border: "1px solid gray" }}>

      <h2>Citizen Cyber Shield</h2>

      <input
        type="text"
        placeholder="Paste suspicious link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      <button onClick={checkURL} style={{ marginTop: "10px" }}>
        Scan Website
      </button>

      <h3>{result}</h3>

    </div>
  );
}