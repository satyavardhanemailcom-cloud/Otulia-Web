import React, { useEffect, useMemo, useState } from "react";
import { FiArrowDown, FiArrowUp, FiCheck, FiPlus, FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import carIcon from "../../assets/icons/car_icon.png";

const FeaturedCarsTab = () => {
  const { token } = useAuth();
  const [selectedCars, setSelectedCars] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const selectedIds = useMemo(() => selectedCars.map((car) => String(car._id)), [selectedCars]);

  useEffect(() => {
    let current = true;
    fetch("/api/admin/featured-cars", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load the featured car selections.");
        return response.json();
      })
      .then((data) => { if (current) setSelectedCars(data.cars || []); })
      .catch((fetchError) => { if (current) setError(fetchError.message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [token]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setSearching(false);
      return undefined;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSearching(true);
      setError("");
      try {
        const response = await fetch(`/api/assets/compare/cars/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Car search is temporarily unavailable.");
        const data = await response.json();
        if (!controller.signal.aborted) setResults(data.data || []);
      } catch (searchError) {
        if (searchError.name !== "AbortError") setError(searchError.message);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 250);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [query]);

  const addCar = (car) => {
    if (selectedIds.includes(String(car._id)) || selectedCars.length >= 9) return;
    setSelectedCars((current) => [...current, car]);
    setNotice("");
  };

  const moveCar = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= selectedCars.length) return;
    setSelectedCars((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setNotice("");
  };

  const saveFeaturedCars = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/featured-cars", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ carIds: selectedIds }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save featured cars.");
      setSelectedCars(data.cars || []);
      setNotice("Featured cars saved. They will appear first on the cars category page.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const visibleResults = results.filter((car) => !selectedIds.includes(String(car._id)));

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in duration-300">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2 text-[#b47c2d]"><FiStar /><span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cars category</span></div>
            <h2 className="mt-2 font-serif text-3xl text-gray-950">Featured Cars</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">Choose and order up to 9 cars. These listings will appear first in the cars category page; remaining cars follow after them.</p>
          </div>
          <div className="shrink-0 rounded-xl bg-[#f8f6f1] px-4 py-3 text-center">
            <p className="text-2xl font-semibold text-gray-900">{selectedCars.length}<span className="text-sm text-gray-400"> / 9</span></p>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-500">Selected</p>
          </div>
        </div>

        <div className="mt-7">
          <label htmlFor="featured-car-search" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">Search active or sold car listings</label>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-[#bd9659]">
            <FiSearch className="shrink-0 text-gray-400" />
            <input id="featured-car-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by make, model, year, or listing name" className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400" />
            {searching && <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-[#b47c2d]" aria-label="Searching" />}
          </div>
          {visibleResults.length > 0 && (
            <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
              {visibleResults.map((car) => (
                <button key={car._id} type="button" disabled={selectedCars.length >= 9} onClick={() => addCar(car)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-gray-50 disabled:opacity-50">
                  <img src={car.images?.[0] || carIcon} alt="" className="h-14 w-20 shrink-0 rounded-md bg-gray-100 object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10px] font-bold uppercase tracking-[0.15em] text-[#a37a43]">{car.brand || "Luxury car"}</span>
                    <span className="block truncate text-sm font-semibold text-gray-800">{car.title || car.specification?.model}</span>
                    <span className="text-xs text-gray-400">{car.specification?.yearOfConstruction || "Year not listed"} · {car.status}</span>
                  </span>
                  <FiPlus className="mr-2 shrink-0 text-[#a37a43]" />
                </button>
              ))}
            </div>
          )}
          {query.trim().length >= 2 && !searching && visibleResults.length === 0 && !error && <p className="mt-2 px-1 text-xs text-gray-400">No unselected active or sold cars match your search.</p>}
          {query.trim().length < 2 && <p className="mt-2 px-1 text-xs text-gray-400">Type at least 2 characters to find a car.</p>}
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">Display order</h3>
            <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400">First car appears first</span>
          </div>
          {loading ? <div className="rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-400">Loading featured cars…</div> : selectedCars.length ? (
            <ol className="space-y-2">
              {selectedCars.map((car, index) => (
                <li key={car._id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 sm:gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3ede2] text-xs font-bold text-[#916d3d]">{String(index + 1).padStart(2, "0")}</span>
                  <img src={car.images?.[0] || carIcon} alt="" className="h-12 w-16 shrink-0 rounded-md bg-gray-100 object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[9px] font-bold uppercase tracking-[0.14em] text-[#a37a43]">{car.brand || "Luxury car"}</span>
                    <span className="block truncate text-sm font-semibold text-gray-800">{car.title || car.specification?.model}</span>
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <button type="button" onClick={() => moveCar(index, -1)} disabled={index === 0} aria-label={`Move car ${index + 1} up`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><FiArrowUp /></button>
                    <button type="button" onClick={() => moveCar(index, 1)} disabled={index === selectedCars.length - 1} aria-label={`Move car ${index + 1} down`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><FiArrowDown /></button>
                    <button type="button" onClick={() => { setSelectedCars((current) => current.filter((item) => String(item._id) !== String(car._id))); setNotice(""); }} aria-label={`Remove ${car.title || car.brand}`} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><FiTrash2 /></button>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">No featured cars selected yet. Search above to add listings.</div>
          )}
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</p>}
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={() => void saveFeaturedCars()} disabled={loading || saving} className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-50">
            <FiCheck /> {saving ? "Saving…" : "Save Featured Cars"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default FeaturedCarsTab;
