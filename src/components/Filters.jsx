import React from "react";

export default function Filters({
  search,
  setSearch,
  year,
  setYear,
  years,
  showSuccessOnly,
  setShowSuccessOnly,
  showFavoritesOnly,
  setShowFavoritesOnly,
}) {
  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
      <input
        type="text"
        placeholder="Search by mission name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", flex: "1" }}
      />
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <label>
        <input
          type="checkbox"
          checked={showSuccessOnly}
          onChange={(e) => setShowSuccessOnly(e.target.checked)}
        />{" "}
        Success Only
      </label>
      <label>
        <input
          type="checkbox"
          checked={showFavoritesOnly}
          onChange={(e) => setShowFavoritesOnly(e.target.checked)}
        />{" "}
        Favorites Only
      </label>
    </div>
  );
}
