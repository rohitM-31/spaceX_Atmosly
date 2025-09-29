import React, { useEffect, useState } from "react";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function GetSpaceX() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [showSuccessOnly, setShowSuccessOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedLaunch, setSelectedLaunch] = useState(null); // For modal

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetch("https://api.spacexdata.com/v4/launches")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setLaunches(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const filteredLaunches = launches.filter((launch) => {
    const matchesSearch = launch.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesYear = year
      ? new Date(launch.date_utc).getFullYear().toString() === year
      : true;
    const matchesSuccess = showSuccessOnly ? launch.success : true;
    const matchesFavorites = showFavoritesOnly
      ? favorites.includes(launch.id)
      : true;
    return matchesSearch && matchesYear && matchesSuccess && matchesFavorites;
  });

  if (loading) return <h2>Loading SpaceX Launches...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🚀 SpaceX Launches</h1>

      {/* Filters */}
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
          {Array.from(
            new Set(
              launches.map((l) =>
                new Date(l.date_utc).getFullYear().toString()
              )
            )
          )
            .sort()
            .map((y) => (
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

      {/* Launch Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredLaunches.map((launch) => (
          <div
            key={launch.id}
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
              <strong>Success:</strong>{" "}
              {launch.success ? "✅ Yes" : "❌ No / Pending"}
            </p>
            {launch.links?.patch?.small && (
              <img
                src={launch.links.patch.small}
                alt={launch.name}
                style={{ width: "100px", marginTop: "10px" }}
              />
            )}
            <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => toggleFavorite(launch.id)}
                style={{
                  padding: "6px 12px",
                  background: favorites.includes(launch.id) ? "gold" : "#eee",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {favorites.includes(launch.id)
                  ? "★ Favorite"
                  : "☆ Add Favorite"}
              </button>
              <button
                onClick={() => setSelectedLaunch(launch)}
                style={{
                  padding: "6px 12px",
                  background: "#2196F3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedLaunch && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedLaunch(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80%",
              overflowY: "auto",
            }}
          >
            <h2>{selectedLaunch.name}</h2>
            {selectedLaunch.links?.patch?.large && (
              <img
                src={selectedLaunch.links.patch.large}
                alt={selectedLaunch.name}
                style={{ width: "150px", marginBottom: "15px" }}
              />
            )}
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedLaunch.date_utc).toLocaleDateString()}
            </p>
            <p>
              <strong>Details:</strong>{" "}
              {selectedLaunch.details
                ? selectedLaunch.details
                : "No details available."}
            </p>
            <p>
              <strong>Rocket ID:</strong> {selectedLaunch.rocket}
            </p>
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              {selectedLaunch.links?.wikipedia && (
                <a
                  href={selectedLaunch.links.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2196F3" }}
                >
                  Wikipedia
                </a>
              )}
              {selectedLaunch.links?.webcast && (
                <a
                  href={selectedLaunch.links.webcast}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2196F3" }}
                >
                  Webcast
                </a>
              )}
            </div>
            <button
              onClick={() => setSelectedLaunch(null)}
              style={{
                marginTop: "20px",
                padding: "6px 12px",
                background: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetSpaceX;
