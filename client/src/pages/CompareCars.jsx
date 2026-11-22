import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiCheck, FiCopy, FiDownload, FiPlus, FiSearch, FiSend, FiShare2, FiX } from "react-icons/fi";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import carIcon from "../assets/icons/car_icon.png";
import whatsappIcon from "../assets/icons/social/whatsapp.svg";
import facebookIcon from "../assets/icons/social/facebook.svg";
import instagramIcon from "../assets/icons/social/instagram.svg";
import linkedInIcon from "../assets/icons/social/linkedin.svg";
import xIcon from "../assets/icons/social/x.svg";

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

const getCarName = (car) => [car.brand || "Luxury car", car.title || [car.specification?.model, car.specification?.variant].filter(Boolean).join(" ")].filter(Boolean).join(" ");

function createComparisonPdf(cars, comparisonUrl) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 14;
  const tableWidth = pageWidth - margin * 2;
  const labelWidth = 46;
  const carWidth = (tableWidth - labelWidth) / cars.length;
  let y = 0;

  const drawTableHeader = () => {
    const carLines = cars.map((car) => pdf.splitTextToSize(getCarName(car), carWidth - 8));
    const headerHeight = Math.max(17, ...carLines.map((lines) => 7 + lines.length * 4));
    pdf.setFillColor(246, 243, 237);
    pdf.rect(margin, y, tableWidth, headerHeight, "F");
    pdf.setDrawColor(224, 218, 207);
    pdf.rect(margin, y, labelWidth, headerHeight);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(132, 119, 98);
    pdf.text("SPECIFICATIONS", margin + 4, y + 7);
    carLines.forEach((lines, index) => {
      const x = margin + labelWidth + carWidth * index;
      pdf.rect(x, y, carWidth, headerHeight);
      pdf.setTextColor(151, 111, 54);
      pdf.text(lines.slice(0, Math.floor((headerHeight - 5) / 4)), x + carWidth / 2, y + 6, { align: "center" });
    });
    y += headerHeight;
  };

  const startPage = (includeUrl = false) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.setTextColor(25, 24, 22);
    pdf.text("Otulia · Car comparison", margin, 14);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(122, 116, 106);
    pdf.text(`Generated ${new Date().toLocaleString()}`, margin, 20);
    y = 27;
    if (includeUrl) {
      pdf.setFontSize(7);
      const urlLines = pdf.splitTextToSize(`Open this comparison: ${comparisonUrl}`, tableWidth);
      pdf.text(urlLines, margin, y);
      y += urlLines.length * 3.5 + 3;
    }
    drawTableHeader();
  };

  startPage(true);
  carSpecs.forEach((section) => {
    if (y + 12 > pageHeight - margin) {
      pdf.addPage();
      startPage();
    }
    pdf.setFillColor(235, 229, 218);
    pdf.rect(margin, y, tableWidth, 8, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(112, 88, 54);
    pdf.text(section.title.toUpperCase(), margin + 4, y + 5.5);
    y += 8;

    section.rows.forEach((row) => {
      const cells = [row.label, ...cars.map((car) => formatValue(row.get(car)))];
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      const lines = cells.map((cell, index) => pdf.splitTextToSize(cell, (index === 0 ? labelWidth : carWidth) - 8));
      const rowHeight = Math.max(8, ...lines.map((cellLines) => cellLines.length * 3.8 + 4));
      if (y + rowHeight > pageHeight - margin) {
        pdf.addPage();
        startPage();
      }
      let x = margin;
      cells.forEach((cell, index) => {
        const width = index === 0 ? labelWidth : carWidth;
        pdf.setDrawColor(232, 228, 220);
        pdf.rect(x, y, width, rowHeight);
        pdf.setTextColor(index === 0 ? 110 : 42, index === 0 ? 105 : 40, index === 0 ? 96 : 36);
        pdf.text(lines[index], x + 4, y + 4.5);
        x += width;
      });
      y += rowHeight;
    });
  });

  const totalPages = pdf.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(145, 139, 129);
    pdf.text(`Otulia · Page ${page} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: "right" });
  }

  const safeNames = cars.map((car) => (car.title || car.brand || "car").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")).join("-vs-");
  return { blob: pdf.output("blob"), fileName: `otulia-comparison-${safeNames || "cars"}.pdf` };
}

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
          placeholder="Enter or paste the NJM IDs or the name of the car for comparing."
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
  const [shareOpen, setShareOpen] = useState(false);
  const [shareNotice, setShareNotice] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const selectedIds = cars.filter(Boolean).map((car) => String(car._id));
  const selectedCars = cars.filter(Boolean);
  const comparisonUrl = window.location.href;
  const comparisonTitle = selectedCars.map(getCarName).join(" vs ") || "Otulia car comparison";
  const shareText = `Compare ${comparisonTitle} on Otulia: ${comparisonUrl}`;

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

  const downloadComparisonPdf = () => {
    const { blob, fileName } = createComparisonPdf(selectedCars, comparisonUrl);
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    return { blob, fileName };
  };

  const handleDownloadPdf = () => {
    try {
      downloadComparisonPdf();
      setShareNotice("Your detailed comparison PDF has been downloaded.");
    } catch {
      setShareNotice("Could not create the comparison PDF. Please try again.");
    }
  };

  const handleSharePdf = async () => {
    setShareBusy(true);
    setShareNotice("");
    try {
      const { blob, fileName } = createComparisonPdf(selectedCars, comparisonUrl);
      if (navigator.share && window.File) {
        const file = new File([blob], fileName, { type: "application/pdf" });
        if (navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: "Otulia car comparison", text: shareText });
            setShareNotice("Choose WhatsApp, Telegram, or another app in your share sheet to send the PDF.");
            return;
          } catch (error) {
            if (error?.name === "AbortError") return;
          }
        }
      }
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setShareNotice("Your PDF was downloaded. Attach it to a message, or use a social share option below to send the comparison link.");
    } catch {
      setShareNotice("Could not create the comparison PDF. Please try again.");
    } finally {
      setShareBusy(false);
    }
  };

  const handleCopyComparison = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setShareNotice("Comparison details and link copied.");
    } catch {
      setShareNotice("Copy was blocked by the browser. You can copy the comparison link from the address bar.");
    }
  };

  const socialShareOptions = [
    { name: "WhatsApp", icon: whatsappIcon, url: `https://wa.me/?text=${encodeURIComponent(shareText)}` },
    { name: "Telegram", Icon: FiSend, url: `https://t.me/share/url?url=${encodeURIComponent(comparisonUrl)}&text=${encodeURIComponent(`Compare ${comparisonTitle} on Otulia`)}` },
    { name: "Facebook", icon: facebookIcon, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(comparisonUrl)}` },
    { name: "Instagram DM", icon: instagramIcon, url: "https://www.instagram.com/direct/new/", copyFirst: true },
    { name: "LinkedIn", icon: linkedInIcon, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(comparisonUrl)}` },
    { name: "X", icon: xIcon, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Compare ${comparisonTitle} on Otulia`)}&url=${encodeURIComponent(comparisonUrl)}` },
  ];

  const openSocialShare = async (option) => {
    const tab = window.open(option.url, "_blank");
    if (!tab) {
      setShareNotice("Your browser blocked the new tab. Allow pop-ups for Otulia, then choose the app again.");
      return;
    }
    tab.opener = null;
    if (option.copyFirst) {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareNotice("Comparison details copied. Paste them into your Instagram DM.");
      } catch {
        setShareNotice("Instagram does not accept prefilled links here. Copy the comparison link from the address bar and paste it into your DM.");
      }
    } else {
      setShareNotice(`Opening ${option.name}. The comparison link will be included; attach the downloaded PDF if you want to send the report file.`);
    }
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
    <main className="min-h-screen bg-[#f8f7f4] pb-20 text-[#171717]">
      <SEO title="Compare Luxury Cars" description="Compare specifications of two luxury cars side by side on Otulia." />
      <Navbar hideSearch />
      <section className="border-b border-[#e9e5de] bg-white px-4 pb-12 sm:px-6 sm:pb-16" style={{ paddingTop: "calc(clamp(50px, 8vh, 80px) + 16px)" }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a37a43]">Otulia · Car comparison</p>
          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">Compare cars. Every detail.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#77736d] sm:text-base">Compare the specifications that matter, side by side. Start with two cars, then add up to two more to see how each one stands.</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => { setShareNotice(""); setShareOpen(true); }}
                disabled={selectedCars.length < 2}
                className="inline-flex items-center gap-2 rounded-full border border-[#ded7ca] bg-white px-4 py-2.5 text-xs font-semibold text-[#4e4941] shadow-sm transition hover:border-[#a77e42] hover:text-[#8a642f] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <FiShare2 aria-hidden="true" /> Share Comparison
              </button>
              <div className="flex items-center gap-2 text-xs text-[#77736d]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#ddd5c7] text-[#9a7441]"><FiCheck /></span>
                <span>Up to date listing details</span>
              </div>
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
      {shareOpen && (
        <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-black/50 p-2 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && setShareOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="comparison-share-title" className="w-full max-w-lg rounded-2xl bg-white p-5 text-[#171717] shadow-2xl sm:p-6">
            <header className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a37a43]">Otulia · Car comparison</p>
                <h2 id="comparison-share-title" className="mt-1 font-serif text-2xl">Share this comparison</h2>
              </div>
              <button type="button" onClick={() => setShareOpen(false)} className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100" aria-label="Close share dialog"><FiX size={20} /></button>
            </header>
            <p className="mt-3 line-clamp-2 text-sm text-[#77736d]">{comparisonTitle}</p>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => void handleSharePdf()} disabled={shareBusy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#38342e] disabled:opacity-60">
                <FiShare2 aria-hidden="true" /> {shareBusy ? "Preparing PDF…" : "Share PDF"}
              </button>
              <button type="button" onClick={handleDownloadPdf} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#ded7ca] px-4 py-3 text-sm font-semibold text-[#4e4941] transition hover:bg-[#f8f6f1]">
                <FiDownload aria-hidden="true" /> Download PDF
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#8a857c]">Share PDF opens your device’s share sheet when available. In browsers without file sharing, the PDF downloads so you can attach it to a message.</p>

            <div className="mt-5 border-t border-[#eeeae3] pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#8a857c]">Share the comparison link</p>
              <div className="grid grid-cols-3 gap-2">
                {socialShareOptions.map((option) => (
                  <button key={option.name} type="button" onClick={() => void openSocialShare(option)} className="flex items-center justify-center gap-2 rounded-lg border border-[#eeeae3] px-2 py-2.5 text-xs font-medium text-[#514c44] transition hover:border-[#cbb58f] hover:bg-[#faf8f4]">
                    {option.icon ? <img src={option.icon} alt="" className="h-4 w-4 object-contain" /> : <option.Icon aria-hidden="true" className="h-4 w-4" />}
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => void handleCopyComparison()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#8a642f] transition hover:bg-[#f8f6f1]">
              <FiCopy aria-hidden="true" /> Copy comparison details and link
            </button>
            {shareNotice && <p role="status" className="mt-3 rounded-lg bg-[#f8f6f1] px-3 py-2.5 text-xs leading-5 text-[#6f685c]">{shareNotice}</p>}
          </section>
        </div>
      )}
    </main>
  );
}
