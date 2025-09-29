import React, { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import Filters from "../components/Filters";
import LaunchList from "../components/List";

export default function Getspace() {
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

  const years = Array.from(
    new Set(launches.map((l) => new Date(l.date_utc).getFullYear().toString()))
  ).sort();

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
      <Filters
        search={search}
        setSearch={setSearch}
        year={year}
        setYear={setYear}
        years={years}
        showSuccessOnly={showSuccessOnly}
        setShowSuccessOnly={setShowSuccessOnly}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
      />
      <LaunchList
        launches={filteredLaunches}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}
