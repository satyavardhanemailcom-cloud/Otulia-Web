import { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';

const ListingSearch = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [acquisition, setAcquisition] = useState('buy');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (location.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`/api/assets/combined?q=${encodeURIComponent(location.trim())}&limit=5`, { signal: controller.signal });
        if (!response.ok) return;
        const result = await response.json();
        setSuggestions([...new Set((result.data || []).map((item) => item.location).filter(Boolean))].slice(0, 5));
      } catch (error) {
        if (error.name !== 'AbortError') setSuggestions([]);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [location]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    setOpen(false);
    onSearch({ location: location.trim(), acquisition });
  };

  return (
    <form ref={containerRef} onSubmit={submit} className="relative z-40 mx-auto mb-7 w-full max-w-[1200px]">
      <div className="flex items-center rounded-full border border-gray-200 bg-white p-1.5 shadow-md">
        <div className="flex min-w-0 flex-[3.5] items-center gap-3 border-r border-gray-200 px-3 sm:px-6">
          <FiMapPin className="shrink-0 text-lg text-gray-500" />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
            placeholder="Search by location"
            aria-label="Search listings by location"
            aria-autocomplete="list"
            className="h-10 w-full min-w-0 border-0 bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-0"
          />
        </div>
        <div className="flex min-w-0 flex-[1.3] items-center px-1 sm:px-3" aria-label="Listing type">
          <div className="flex w-full items-center rounded-full bg-gray-100 p-1">
            {['buy', 'rent'].map((type) => (
              <button key={type} type="button" onClick={() => setAcquisition(type)} aria-pressed={acquisition === type}
                className={`flex-1 rounded-full px-2 py-2 text-xs font-medium capitalize transition sm:text-sm ${acquisition === type ? 'bg-[#111] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {type === 'buy' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" aria-label="Search listings" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111] text-white transition hover:bg-black sm:h-12 sm:w-12">
          <FiSearch className="text-lg" />
        </button>
      </div>
      {open && suggestions.length > 0 && (
        <ul role="listbox" className="absolute left-2 right-2 top-full mt-2 max-h-60 overflow-y-auto rounded-2xl border border-gray-200 bg-white py-2 shadow-xl sm:left-6 sm:right-auto sm:w-80">
          {suggestions.map((suggestion) => (
            <li key={suggestion} role="option" aria-selected="false">
              <button type="button" onClick={() => { setLocation(suggestion); setSuggestions([]); setOpen(false); }} className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100">
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default ListingSearch;
