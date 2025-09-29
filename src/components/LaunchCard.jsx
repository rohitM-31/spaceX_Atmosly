import React from "react";

export default function LaunchCard({ launch, isFavorite, toggleFavorite }) {
  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        background: "#f9f9f9",
        textAlign: "center",
        position: "relative",
      }}
    >
      <h2>{launch.name}</h2>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(launch.date_utc).toLocaleDateString()}
      </p>
      <p>
        <strong>Success:</strong> {launch.success ? "✅ Yes" : "❌ No / Pending"}
      </p>
      {launch.links?.patch?.small && (
        <img
          src={launch.links.patch.small}
          alt={launch.name}
          style={{ width: "100px", marginTop: "10px" }}
        />
      )}
      <button
        onClick={() => toggleFavorite(launch.id)}
        style={{
          marginTop: "10px",
          padding: "6px 12px",
          background: isFavorite ? "gold" : "#eee",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {isFavorite ? "★ Favorite" : "☆ Add Favorite"}
      </button>
    </div>
  );
}
