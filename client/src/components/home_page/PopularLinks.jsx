import React, { useEffect, useState } from 'react';

const PopularLinks = () => {
  const [databaseBrands, setDatabaseBrands] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/assets/car-taxonomy?activeOnly=true', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setDatabaseBrands(data?.databaseBrands || []))
      .catch((error) => { if (error.name !== 'AbortError') console.error('Could not load popular car brands:', error); });
    return () => controller.abort();
  }, []);
  const citiesAndRegions = [
    { label: 'Private islands for sale', path: '/listings/private-islands' },
    { label: 'Balearic Islands homes for sale', path: '/listings/balearic-islands' },
    { label: 'Costa del Sol homes for sale', path: '/listings/costa-del-sol' },
    { label: 'French Riviera homes for sale', path: '/listings/french-riviera' },
    { label: 'Tuscany homes for sale', path: '/listings/tuscany' },
    { label: 'Amsterdam homes for sale', path: '/listings/amsterdam' },
    { label: 'Atlanta homes for sale', path: '/listings/atlanta' },
    { label: 'Austin homes for sale', path: '/listings/austin' },
    { label: 'Benahavís homes for sale', path: '/listings/benahavis' },
    { label: 'Beverly Hills homes for sale', path: '/listings/beverly-hills' },
  ];

  const countries = [
    { label: 'Homes for sale in Australia', path: '/listings/australia' },
    { label: 'Homes for sale in British Virgin Islands', path: '/listings/british-virgin-islands' },
    { label: 'Homes for sale in Canada', path: '/listings/canada' },
    { label: 'Homes for sale in Cayman Islands', path: '/listings/cayman-islands' },
    { label: 'Homes for sale in France', path: '/listings/france' },
    { label: 'Homes for sale in Germany', path: '/listings/germany' },
    { label: 'Homes for sale in Greece', path: '/listings/greece' },
    { label: 'Homes for sale in India', path: '/listings/india' },
    { label: 'Homes for sale in Ireland', path: '/listings/ireland' },
    { label: 'Homes for sale in Monaco', path: '/listings/monaco' },
  ];

  const cars = [
    { label: 'Ferrari for sale', path: '/listings/ferrari' },
    { label: 'Aston Martin for sale', path: '/listings/aston-martin' },
    { label: 'Koenigsegg for sale', path: '/listings/koenigsegg' },
    { label: 'Lamborghini for sale', path: '/listings/lamborghini' },
    { label: 'Bugatti for sale', path: '/listings/bugatti' },
    { label: 'Maserati for sale', path: '/listings/maserati' },
    { label: 'Pagani for sale', path: '/listings/pagani' },
    { label: 'Porsche for sale', path: '/listings/porsche' },
    { label: 'Rolls-Royce for sale', path: '/listings/rolls-royce' },
  ];
  const normalizeBrand = (brand) => brand
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const knownBrandNames = new Map(cars.map(({ label }) => {
    const name = label.replace(/ for sale$/i, '');
    return [normalizeBrand(name), name];
  }));
  const dynamicCars = databaseBrands
    .filter((brand) => typeof brand === 'string' && brand.trim())
    .map((brand) => {
      const canonical = knownBrandNames.get(normalizeBrand(brand.trim())) || brand.trim();
      const slug = canonical.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return { label: `${canonical} for sale`, path: `/listings/${slug}` };
    })
    .filter((link) => !cars.some((existing) => existing.path === link.path))
    .filter((link, index, links) => links.findIndex((candidate) => candidate.path === link.path) === index);
  const allCars = [...cars, ...dynamicCars];

  const renderLinks = (group, links) => {
    const isExpanded = Boolean(expandedGroups[group]);
    const visibleLinks = isExpanded ? links : links.slice(0, 10);

    return (
      <>
        <ul className="space-y-3">
          {visibleLinks.map((link) => (
            <li key={link.path}>
              <a
                href={link.path}
                onClick={() => handleLinkClick(link.label, link.path)}
                className="text-gray-600 hover:text-[#D48D2A] transition-colors duration-200 text-sm hover:font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {links.length > 10 && (
          <button
            type="button"
            onClick={() => setExpandedGroups((current) => ({ ...current, [group]: !isExpanded }))}
            className="mt-3 text-sm font-medium text-gray-700 hover:text-[#D48D2A] transition-colors"
          >
            {isExpanded ? 'View less' : 'View all'}
          </button>
        )}
      </>
    );
  };

  const handleLinkClick = (label, path) => {
    // Track breadcrumb for analytics or state if needed
    console.log(`Navigating: ${label}`);
  };

  return (
    <div className="w-full bg-white py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-full mx-auto md:ml-14">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 md:mb-12 text-center"></div>

        {/* Popular Links Section Title */}
        <h2 className="text-3xl md:text-3xl canela text-black font-bold text-start mb-8 text-gray-900">
          Popular Links
        </h2>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-8">
          {/* Cities & Regions Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 ">
              Cities & Regions
            </h3>
            {renderLinks('cities', citiesAndRegions)}
          </div>

          {/* Countries Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 ">
              Countries
            </h3>
            {renderLinks('countries', countries)}
          </div>

          {/* Cars Column */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 ">
              Cars
            </h3>
            {renderLinks('cars', allCars)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularLinks;
