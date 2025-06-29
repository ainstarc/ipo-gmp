"use client";

import React, { useEffect, useState } from "react";

const PING_URL = "https://encryption-hub.onrender.com/";

const PingStatus: React.FC = () => {
  const [status, setStatus] = useState<"up" | "down" | "loading">("loading");

  useEffect(() => {
    const checkPing = async () => {
      try {
        const res = await fetch(PING_URL, { cache: "no-store" });
        setStatus(res.ok ? "up" : "down");
      } catch {
        setStatus("down");
      }
    };

    checkPing();
    const interval = setInterval(checkPing, 60_000); // every 1 minute
    return () => clearInterval(interval);
  }, []);

  const color =
    status === "loading" ? "#999" : status === "up" ? "#28a745" : "#dc3545";

  return (
    <div
      title={`Encryption Hub: ${status}`}
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 9999,
        background: color,
        borderRadius: "50%",
        width: 12,
        height: 12,
        boxShadow: "0 0 0 2px #fff, 0 0 6px rgba(0,0,0,0.2)",
        transition: "background 0.3s",
      }}
    />
  );
};

export default PingStatus;
