// Sample listings shown ONLY when a location page has no real listings yet.
// Data and photos are taken from the JamesEdition reference page.
// Remove this file (and its import in EstateListingTemplate) once every page has real listings.

const IMG = 'https://img.jamesedition.com/listing_images/2026';

const SAMPLES = [
  { type: 'House', beds: 5, baths: 4, area: '6,717 Sqft', price: null, agent: 'Heath Williams', photos: 35, video: true,
    title: 'A Landmark Residence of Rare Scale', images: [`${IMG}/08/24/05/48/56/f00c7ae3-4274-473e-a0d4-708b078151d1/je/556x342xcxm.jpg`, `${IMG}/07/24/15/25/08/3e7229ed-2d3c-4303-b6ed-1fd8199dadad/je/355x210xc.jpg`, `${IMG}/07/24/15/25/08/95b03a74-67c8-44d3-96f4-62421237808b/je/355x210xc.jpg`],
    amenities: ['Pool', 'Terrace', 'Garage', 'Fireplace'],
    description: 'Commanding a magnificent presence, this architectural residence pairs resort-style living with uninterrupted views.' },
  { type: 'House', beds: 1, baths: 1, area: '', price: null, agent: 'Dean Lewisman', photos: 16, video: true,
    title: 'Countryside Retreat', images: [`${IMG}/10/15/07/23/34/ad485fe9-ae58-4202-ae91-5ba72041f2b3/je/556x342xcxm.jpg`] },
  { type: 'House', beds: 6, baths: 3, area: '6,792 Sqft', price: null, agent: 'Jamie Hill', photos: 31, video: true,
    title: 'Mountain View: A Georgian-Inspired Estate', images: [`${IMG}/09/10/17/06/31/a82c3b44-33f6-4dc8-9694-978e5cb1cc31/je/556x342xcxm.jpg`] },
  { type: 'House', beds: 7, baths: 4, area: '', price: null, agent: 'Champions in Real Estate', photos: 29, video: true,
    title: 'An Opportunity to Create the Lifestyle You Deserve', images: [`${IMG}/08/20/10/20/15/6287dd19-3611-4552-8e5b-7182a1853c11/je/556x342xcxm.jpg`] },
  { type: 'House', beds: 6, baths: 5, area: '11,840 Sqft', price: null, agent: 'Heath Williams', photos: 46, video: true,
    title: 'Grand Riverfront Estate', images: [`${IMG}/09/23/16/54/29/43d91510-3478-49b4-9a6d-b3906f61db11/je/556x342xcxm.jpg`] },
  { type: 'House', beds: 4, baths: 5, area: '4,521 Sqft', price: 2737871, agent: 'Brae & Josie', photos: 110, video: true, virtualTour: true,
    title: 'Absolute Beachfront Luxury Across Two Titles', images: [`${IMG}/09/12/11/53/58/17ade111-0952-4ccb-afe8-49a47e4db83f/je/556x342xcxm.jpg`] },
  { type: 'Townhouse', beds: 2, baths: 4, area: '3,627 Sqft', price: 2035853, agent: 'Brae & Josie', photos: 78, video: true, virtualTour: true,
    title: 'Escape to Luxury: Your Dream Beachfront Home', images: [`${IMG}/09/11/17/54/10/e14e8928-d3bf-4cbf-97c0-9c276d35e20d/je/556x342xcxm.jpg`] },
  { type: 'House', beds: 5, baths: 5, area: '8,041 Sqft', price: null, agent: 'Michael Bacon', photos: 26, video: true,
    title: 'Architectural Masterpiece of Unrivalled Luxury', images: [`${IMG}/07/01/18/35/28/771d3c49-e32a-4f16-b540-6f87888e4d8d/je/556x342xcxm.jpg`] },
  { type: 'House', beds: 3, baths: 3, area: '', price: 1579541, agent: 'Sean Thorpe', photos: 35, video: true,
    title: 'Mana Moana', images: [`${IMG}/07/13/14/22/17/a7c4aba6-b826-4be7-8bba-25a103b2d2c6/je/556x342xcxm.jpg`] },
  { type: 'House', beds: 5, baths: 4, area: '', price: 3510092, agent: 'Jan Hooghe', photos: 37, video: true,
    title: 'Copeman Estate', images: [`${IMG}/07/30/16/41/51/75c74e65-3307-434a-bc51-122f4ecd0edd/je/556x342xcxm.jpg`] },
];

// Builds sample listings in the same shape the API returns, using the page's place name.
export const getPlaceholderListings = (placeName, isIsland = false) => SAMPLES.slice(0, 9).map((sample, index) => ({
  _id: `placeholder-${index}`,
  isPlaceholder: true,
  category: 'estate',
  title: sample.title,
  description: sample.description || '',
  price: sample.price || 0,
  isPriceOnRequest: !sample.price,
  location: placeName,
  images: sample.images,
  photoCount: sample.photos,
  videoUrl: sample.video ? '#' : '',
  virtualTour: Boolean(sample.virtualTour),
  amenities: sample.amenities || [],
  keySpecifications: {
    bedrooms: String(sample.beds),
    bathrooms: String(sample.baths),
    builtUpArea: sample.area,
    propertyType: isIsland ? 'Private Island' : sample.type,
  },
  agent: { name: sample.agent },
}));
