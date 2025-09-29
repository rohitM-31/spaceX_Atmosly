import React from "react";
import LaunchCard from "./LaunchCard";

export default function List({ launches, favorites, toggleFavorite }) {
  if (launches.length === 0) {
    return <p style={{ textAlign: "center" }}>No launches found.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
      }}
    >
      {launches.map((launch) => (
        <LaunchCard
          key={launch.id}
          launch={launch}
          isFavorite={favorites.includes(launch.id)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}
