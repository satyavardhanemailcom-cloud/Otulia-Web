import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiCheck, FiPlus, FiSearch, FiX } from "react-icons/fi";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import carIcon from "../assets/icons/car_icon.png";

const cleanValue = (value) => value === null || value === undefined || value === "" || value === "-";

const carSpecs = [
  {
    title: "The essentials",
    rows: [
      { label: "Make", get: (car) => car.brand || car.specification?.brand },
      { label: "Model", get: (car) => car.specification?.model || car.title },
      { label: "Variant", get: (car) => car.variant || car.specification?.variant },
      { label: "Series", get: (car) => car.specification?.series },
      { label: "Body style", get: (car) => car.specification?.body },
      { label: "Year", get: (car) => car.specification?.yearOfConstruction },
      {
        label: "Price",
        get: (car) => car.isPriceOnRequest ? "Price on request" : car.price ? `$${Number(car.price).toLocaleString()}` : null,
      },
      { label: "Listing status", get: (car) => car.status === "Sold" ? "Sold" : car.type === "Rent" ? "For rent" : "For sale" },
      { label: "Mileage", get: (car) => car.specification?.mileage },
    ],
  },
  {
    title: "Performance & drivetrain",
    rows: [
      { label: "Engine configuration", get: (car) => car.specification?.engineType || car.specification?.engine || car.keySpecifications?.engineType },
      { label: "Engine capacity", get: (car) => car.specification?.cylinderCapacity },
      { label: "Power output", get: (car) => car.specification?.power || car.keySpecifications?.power },
      { label: "Torque", get: (car) => car.specification?.torque },
      { label: "Top speed", get: (car) => car.specification?.topSpeed || car.keySpecifications?.topSpeed },
      { label: "Acceleration", get: (car) => car.specification?.acceleration },
      { label: "Transmission", get: (car) => car.specification?.transmission },
      { label: "Drive", get: (car) => car.specification?.drive },
      { label: "Fuel", get: (car) => car.specification?.fuel },
      { label: "Configuration", get: (car) => car.specification?.configuration },
      { label: "Consumption", get: (car) => car.specification?.consumption },
      { label: "CO₂ emissions", get: (car) => car.specification?.co2Emission },
      { label: "Steering", get: (car) => car.specification?.steering },
    ],
  },
  {
    title: "Design & condition",
    rows: [
      { label: "Exterior colour", get: (car) => car.specification?.exteriorColor },
      { label: "Manufacturer colour code", get: (car) => car.specification?.manufacturerColorCode },
      { label: "Interior material", get: (car) => car.specification?.interiorMaterial },
      { label: "Interior colour", get: (car) => car.specification?.interiorColor },
      { label: "Condition", get: (car) => car.specification?.condition },
      { label: "Usage", get: (car) => car.specification?.usageStatus },
      { label: "Accident free", get: (car) => car.specification?.accidentFree },
      { label: "Accident history", get: (car) => car.specification?.accidentHistory },
      { label: "Soul of the car", get: (car) => car.specification?.soulOfTheCar },
      { label: "Ideal buyer", get: (car) => car.specification?.idealBuyer },
    ],
  },
  {
    title: "Ownership & provenance",
    rows: [
      { label: "Country of first delivery", get: (car) => car.specification?.countryOfFirstDelivery },
      { label: "Number of owners", get: (car) => car.specification?.numberOfOwners },
      { label: "Matching numbers", get: (car) => car.specification?.matchingNumbers },
      { label: "Location", get: (car) => car.location || car.specification?.carLocation },
    ],
  },
];

const formatValue = (value) => {
  if (cleanValue(value)) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "—";
  return String(value);
};

function CarSearch({ excludedIds, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/assets/compare/cars/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search is temporarily unavailable.");
        const payload = await response.json();
        setResults((payload.data || []).filter((car) => !excludedIds.includes(String(car._id))));
      } catch (searchError) {
        if (searchError.name !== "AbortError") setError(searchError.message || "Could not search cars.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, excludedIds]);

  return (
    <div className="relative">
      <label className="flex items-center gap-3 rounded-xl border border-[#e8e4dc] bg-white px-4 py-3.5 shadow-[0_8px_28px_rgba(30,24,15,0.04)] transition focus-within:border-[#bd9659] focus-within:ring-4 focus-within:ring-[#bd9659]/10">
        <FiSearch className="shrink-0 text-[#9b8055]" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search make, model or year"
          aria-label="Search cars to compare"
          className="w-full bg-transparent text-sm text-[#171717] outline-none placeholder:text-[#99958e]"
        />
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#e9e1d4] border-t-[#a77e42]" aria-label="Searching" />}
      </label>

      {query.trim().length >= 2 && (results.length > 0 || error || (!loading && !error)) && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-80 overflow-y-auto rounded-xl border border-[#ece8e1] bg-white p-2 shadow-[0_20px_60px_rgba(21,18,12,0.16)]">
          {error ? (
            <p className="px-3 py-4 text-sm text-red-600">{error}</p>
          ) : results.length === 0 && !loading ? (
            <p className="px-3 py-4 text-sm text-gray-500">No matching cars found. Try a make or model name.</p>
          ) : results.map((car) => (
            <button
              key={car._id}
              type="button"
              onClick={() => { onSelect(car); setQuery(""); }}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-[#f8f6f1] focus:bg-[#f8f6f1] focus:outline-none"
            >
              <img src={car.images?.[0] || carIcon} alt="" className="h-14 w-[76px] shrink-0 rounded-md bg-[#f3f1ed] object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7441]">{car.brand || "Luxury car"}</span>
                <span className="mt-0.5 block truncate text-sm font-semibold text-[#171717]">{car.title || [car.specification?.model, car.specification?.variant].filter(Boolean).join(" ")}</span>
                <span className="mt-0.5 block text-xs text-[#77736d]">{car.specification?.yearOfConstruction || "Year not listed"} · {car.status === "Sold" ? "Sold" : car.isPriceOnRequest ? "Price on request" : car.price ? `$${Number(car.price).toLocaleString()}` : "Contact for price"}</span>
              </span>
              <FiPlus className="mr-2 shrink-0 text-[#a77e42]" />
            </button>
          ))}
        </div>
      )}
      {query.trim().length < 2 && <p className="mt-2 px-1 text-[11px] text-[#908b82]">Type at least 2 characters to search the car collection.</p>}
    </div>
  );
}

function SelectedCar({ car, slot, onRemove, onChange }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e9e5de] bg-white shadow-[0_14px_38px_rgba(30,24,15,0.05)]">
      <div className="relative h-52 bg-[#f2f0eb] sm:h-60">
        <img src={car.images?.[0] || carIcon} alt={car.title || "Selected car"} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />
        <span className="absolute bottom-4 left-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">Car {slot + 1}</span>
        <button type="button" onClick={onRemove} aria-label={`Remove car ${slot + 1}`} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#2b2925] shadow transition hover:bg-white">
          <FiX />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a37a43]">{car.brand || "Selected car"}</p>
          <h2 className="mt-1 truncate font-serif text-xl text-[#171717]">{car.title || [car.specification?.model, car.specification?.variant].filter(Boolean).join(" ")}</h2>
        </div>
        <button type="button" onClick={onChange} className="shrink-0 rounded-full border border-[#ded7ca] px-4 py-2 text-xs font-semibold text-[#555047] transition hover:border-[#a77e42] hover:text-[#8a642f]">Change</button>
      </div>
    </article>
  );
}

function SpecsTable({ cars }) {
  const sections = useMemo(() => carSpecs.map((section) => ({
    ...section,
    rows: section.rows.filter((row) => cars.some((car) => car && !cleanValue(row.get(car)))),
  })).filter((section) => section.rows.length), [cars]);

  return (
    <div className="mt-14">
      <div className="mb-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#a37a43]">Side by side</p>
        <h2 className="mt-2 font-serif text-3xl text-[#171717] sm:text-4xl">Specifications</h2>
        <div className="mx-auto mt-4 h-px w-16 bg-[#c4a16b]" />
      </div>
      {sections.length ? (
        <div className="overflow-x-auto rounded-2xl border border-[#e8e4dc] bg-white shadow-[0_14px_42px_rgba(30,24,15,0.04)]">
          <div className={cars.length > 2 ? "min-w-[1000px]" : "min-w-[760px]"}>
          {sections.map((section) => (
            <div key={section.title}>
              <div className="grid items-center gap-3 border-b border-[#e9e5de] bg-[#f8f6f1] px-4 py-3 sm:gap-6 sm:px-7" style={{ gridTemplateColumns: `minmax(115px,0.72fr) repeat(${cars.length},minmax(0,1fr))` }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b8377]">{section.title}</p>
                {cars.map((car, index) => (
                  <p key={index} className="truncate text-center text-[9px] font-bold uppercase tracking-[0.16em] text-[#9a7441]">{car ? car.brand || "Selected car" : `Car ${index + 1}`}</p>
                ))}
              </div>
              {section.rows.map((row) => {
                const values = cars.map((car) => car ? formatValue(row.get(car)) : "Add a car");
                const distinctValues = new Set(values.filter((value, index) => cars[index] && value !== "—"));
                const different = distinctValues.size > 1;
                return (
                  <div key={row.label} className="grid items-center gap-3 border-b border-[#efede8] px-4 py-4 last:border-b-0 sm:gap-6 sm:px-7" style={{ gridTemplateColumns: `minmax(115px,0.72fr) repeat(${cars.length},minmax(0,1fr))` }}>
                    <p className="text-xs font-medium text-[#77736d] sm:text-sm">{row.label}</p>
                    {values.map((value, index) => (
                      <p key={index} className={`break-words text-center text-xs sm:text-sm ${different ? "font-semibold text-[#8e682f]" : "text-[#282622]"}`}>{value}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#ddd6c9] bg-white px-6 py-10 text-center text-sm text-[#8d877d]">
          Add a car above to begin your side-by-side comparison.
        </div>
      )}
    </div>
  );
}

export default function CompareCars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([null, null]);
  const [loadingSharedCars, setLoadingSharedCars] = useState(true);
  const selectedIds = cars.filter(Boolean).map((car) => String(car._id));

  useEffect(() => {
    let active = true;
    const ids = [1, 2, 3, 4].map((index) => searchParams.get(`car${index}`));
    Promise.all(ids.map(async (id) => {
      if (!id) return null;
      try {
        const response = await fetch(`/api/assets/compare/cars/${encodeURIComponent(id)}`);
        return response.ok ? response.json() : null;
      } catch {
        return null;
      }
    })).then((loaded) => {
      if (active) {
        const uniqueCars = loaded.map((car, index) => car && loaded.slice(0, index).some((previous) => String(previous?._id) === String(car._id)) ? null : car);
        const lastSelectedIndex = uniqueCars.reduce((last, car, index) => car ? index : last, -1);
        setCars(uniqueCars.slice(0, Math.max(2, lastSelectedIndex + 1)));
      }
    }).finally(() => { if (active) setLoadingSharedCars(false); });
    return () => { active = false; };
  }, []);

  const setCar = (index, car) => {
    const next = [...cars];
    next[index] = car;
    setCars(next);
    setSearchParams((current) => {
      const params = new URLSearchParams(current);
      const key = `car${index + 1}`;
      if (car) params.set(key, car._id);
      else params.delete(key);
      return params;
    }, { replace: true });
  };

  const carSlots = cars.map((car, index) => (
    car ? (
      <SelectedCar key={`selected-${index}`} car={car} slot={index} onRemove={() => setCar(index, null)} onChange={() => setCar(index, null)} />
    ) : (
      <div key={`empty-${index}`} className="flex min-h-[345px] flex-col justify-center rounded-2xl border border-dashed border-[#d9d2c6] bg-[#fbfaf8] p-5 sm:min-h-[365px] sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#efe9de] text-xs font-semibold text-[#947345]">0{index + 1}</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a37a43]">Car {index + 1}</p>
      <p className="mt-0.5 text-sm text-[#6d685f]">{index < 2 ? "Choose a vehicle to compare" : "Add another vehicle (optional)"}</p>
          </div>
        </div>
        <CarSearch excludedIds={selectedIds} onSelect={(car) => setCar(index, car)} />
      </div>
    )
  ));

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-20 pt-24 text-[#171717]">
      <SEO title="Compare Luxury Cars" description="Compare specifications of two luxury cars side by side on Otulia." />
      <Navbar hideSearch />
      <section className="border-b border-[#e9e5de] bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a37a43]">Otulia · Car comparison</p>
          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">Two cars. Every detail.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#77736d] sm:text-base">Compare the specifications that matter, side by side. Start with two cars, then add up to two more to see how each one stands.</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-xs text-[#77736d]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ddd5c7] text-[#9a7441]"><FiCheck /></span>
              <span>Up to date listing details</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-9 sm:px-6 sm:pt-12">
        {loadingSharedCars && <div className="mb-4 h-1 w-full animate-pulse rounded bg-[#e9e3d8]" />}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">{carSlots}</div>
        {cars.length < 4 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setCars((current) => current.length < 4 ? [...current, null] : current)}
              className="inline-flex items-center gap-2 rounded-full border border-[#cbb58f] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#765b32] transition hover:bg-[#f1ece2]"
            >
              <FiPlus aria-hidden="true" /> Add another vehicle
            </button>
            <span className="text-xs text-[#908b82]">Up to 4 vehicles</span>
          </div>
        )}
        <SpecsTable cars={cars} />
      </div>
    </main>
  );
}
