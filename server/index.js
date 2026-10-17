const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const compression = require("compression");
const connectDB = require("./db.js");
const fs = require("fs");
const mongoose = require("mongoose");
const CarAsset = require("./models/CarAsset.model.js");
const EstateAsset = require("./models/EstateAsset.model.js");
const BikeAsset = require("./models/BikeAsset.model.js");
const YachtAsset = require("./models/YachtAsset.model.js");
const RankingCategory = require("./models/RankingCategory.model.js");
const User = require("./models/User.model.js");
const Listing = require("./models/Listing.model.js");

// middleware import
const corsMiddleware = require("./middleware/cors.middleware.js");

// route import
const homeRoutes = require("./routes/home.routes.js");
const listingRoutes = require("./routes/listing.routes.js");
const assetsRoutes = require("./routes/assets.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const trendingRoutes = require("./routes/trending.routes.js");
const popularRoutes = require("./routes/popular.routes.js");
const sellerRoutes = require("./routes/seller.routes.js");
const activityRoutes = require("./routes/activity.routes.js");
const paymentRoutes = require("./routes/payment.routes.js");
const createListingRoutes = require("./routes/create_listing.routes.js");
const uploadRoutes = require("./routes/upload.routes.js");
const inventoryRoutes = require("./routes/inventory.routes.js");
const leadRoutes = require("./routes/lead.routes.js");
const couponRoutes = require("./routes/coupon.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const sitemapRoutes = require("./routes/sitemap.routes.js");
const carRankingRoutes = require("./routes/car-ranking.routes.js");

const app = express();
app.use(compression());

// Legacy Shopify/Wix URLs: 301 to the current equivalent, 410 when nothing equivalent exists.
// Runs before the host redirect so www/http legacy URLs resolve in a single hop.
const LEGACY_BASE =
  process.env.NODE_ENV === "production" ? "https://otulia.com" : "";

// Yacht and bike products are omitted (410) while those categories are "coming soon".
const WIX_PRODUCT_301 = new Map([
  ["lamborghini-huracan", "/listings/lamborghini"],
  ["rolls-royce-phantom-ghost", "/listings/rolls-royce"],
  ["new-atura-spider", "/category/cars"],
  ["french-palace", "/category/estates"],
  ["italian-mansion", "/category/estates"],
  ["modern-penthouse", "/category/estates"],
]);

const LEGACY_301 = [
  [/^\/(home|index\.html?|collections\/home-otulia-1)$/, "/"],
  [/^\/about-us$|^\/pages\/about(-us)?$/, "/about"],
  [/^\/contact-us$|^\/pages\/contact(-us)?$/, "/contact"],
  [/^\/frequently-asked-questions$|^\/pages\/faqs?$/, "/faq"],
  [/^\/terms-and-conditions$|^\/policies\/terms-of-service$/, "/terms"],
  [/^\/legal\/privacy$|^\/policies\/privacy-policy$/, "/privacy-policy"],
  [
    /^\/(shipping-info|shipping-policy|policies\/shipping-policy)$/,
    "/shipping",
  ],
  [/^\/(return-policy|refund-policy|policies\/refund-policy)$/, "/returns"],
  [/^\/cookies-policy$/, "/cookie-policy"],
  [/^\/sell-with-us$/, "/sellwithus"],
  [/^\/pricing-plans(\/.*)?$/, "/pricing"],
  [/^\/post\/.+$/, "/journal"],
  [/^\/blog$/, "/blogs"],
  [/^\/(shop-1|search|category\/all-products)$/, "/shop"],
  [/^\/category$/, "/category/cars"],
  [/^\/product-page\/([^/]+)$/, (m) => WIX_PRODUCT_301.get(m[1])],
];

const LEGACY_410 = [
  /^\/products(\/|$)/,
  /^\/collections(\/|$)/,
  /^\/pages(\/|$)/,
  /^\/policies(\/|$)/,
  /^\/product-page(\/|$)/,
  /^\/category\/(?!(cars|estates|yachts|bikes)$)[^/]+$/,
  /^\/category-page(\/|$)/,
  /^\/(members-area|courses-1|portfolio|portfolio-collections|account)(\/|$)/,
  /^\/(loyalty|blog-feed\.xml|password|_zc|120)$/,
  /^\/(sitemap_[a-z0-9_]+|[a-z0-9-]+-sitemap)\.xml$/,
  /^\/9-[a-z0-9-]+$/,
  /^\/(book-lovers|book-vase|drain-strainer|piano-labels|space-saving|tower-game|charger-bag|va513133)$/,
];

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const legacyPath = req.path.toLowerCase().replace(/\/+$/, "") || "/";
  for (const [pattern, destination] of LEGACY_301) {
    const match = legacyPath.match(pattern);
    if (!match) continue;
    const target =
      typeof destination === "function" ? destination(match) : destination;
    if (target) return res.redirect(301, `${LEGACY_BASE}${target}`);
  }
  if (LEGACY_410.some((pattern) => pattern.test(legacyPath))) {
    return res.status(410).type("text/plain").send("Gone");
  }
  next();
});

// Enforce HTTPS and Non-WWW Canonical Domain in Production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const host = (req.get("host") || "").split(":")[0].toLowerCase();
    const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
      .split(",")[0]
      .trim();

    // Do NOT alter path casing or normalize for static assets, uploads, API, or files with extensions
    const isStaticOrApi =
      req.path.startsWith("/api/") ||
      req.path.startsWith("/assets/") ||
      req.path.startsWith("/uploads/") ||
      req.path.startsWith("/images/") ||
      req.path.startsWith("/logos/") ||
      req.path.startsWith("/icons/") ||
      /\.[a-zA-Z0-9]+$/.test(req.path);

    if (isStaticOrApi) {
      if (forwardedProto !== "https" || (host && host !== "otulia.com")) {
        return res.redirect(301, `https://otulia.com${req.originalUrl}`);
      }
      return next();
    }

    const queryIndex = req.originalUrl.indexOf("?");
    const query = queryIndex === -1 ? "" : req.originalUrl.slice(queryIndex);
    let canonicalPath = req.path
      .replace(/^\/asset\/cars(?=\/)/i, "/asset/car")
      .replace(/^\/asset\/estates(?=\/)/i, "/asset/estate")
      .replace(/^\/asset\/bikes(?=\/)/i, "/asset/bike")
      .replace(/^\/asset\/yachts(?=\/)/i, "/asset/yacht")
      .toLowerCase();

    if (canonicalPath.length > 1)
      canonicalPath = canonicalPath.replace(/\/+$/, "");

    if (
      forwardedProto !== "https" ||
      host !== "otulia.com" ||
      canonicalPath !== req.path
    ) {
      return res.redirect(301, `https://otulia.com${canonicalPath}${query}`);
    }
  }
  next();
});

connectDB();

app.use(express.json());
app.use(corsMiddleware);

// Sitemap MUST be at the top of all routes
app.use("/", sitemapRoutes);

// Social preview bots read the initial HTML and do not run the React app.
// Put listing-specific Open Graph values into that response on the server.
const listingModels = { car: CarAsset, estate: EstateAsset, bike: BikeAsset, yacht: YachtAsset };
const htmlEscape = (value) => String(value || "").replace(/[&<>\"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));
const jsonForHtml = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const publicUrl = (value) => {
  try {
    const url = new URL(value, "https://otulia.com");
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch { return ""; }
};
const socialPreviewImage = (value) => {
  const imageUrl = publicUrl(value);
  if (!imageUrl) return "";
  try {
    const parsed = new URL(imageUrl);
    if (parsed.hostname === "res.cloudinary.com" && parsed.pathname.includes("/image/upload/")) {
      parsed.pathname = parsed.pathname.replace(
        "/image/upload/",
        "/image/upload/c_fill,g_auto,w_1200,h_630,q_auto:good,f_jpg/",
      );
    }
    return parsed.toString();
  } catch { return imageUrl; }
};
const assetSlug = (title, id) => {
  const titleSlug = String(title || "").trim().toLowerCase()
    .replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  return [titleSlug, id ? String(id) : ""].filter(Boolean).join("-");
};

const assetSeoDetails = (asset) => {
  const specification = asset.specification || {};
  const publicSpecificationLabels = {
    yearOfConstruction: "Year", year: "Year", model: "Model", variant: "Variant", body: "Body style",
    mileage: "Mileage", mileageKM: "Mileage", power: "Power", maxPower: "Maximum power",
    cylinderCapacity: "Engine capacity", engineCapacityCC: "Engine capacity", topSpeed: "Top speed",
    engineType: "Engine", transmission: "Transmission", drive: "Drive", fuel: "Fuel",
    fuelType: "Fuel type", exteriorColor: "Exterior color", interiorColor: "Interior color",
    condition: "Condition", propertyType: "Property type", bedrooms: "Bedrooms", bathrooms: "Bathrooms",
    builtUpArea: "Built-up area", landArea: "Land area", yachtType: "Yacht type", length: "Length",
    beam: "Beam", draft: "Draft", guestCapacity: "Guest capacity", crewCapacity: "Crew capacity",
    hullMaterial: "Hull material", usageHours: "Usage hours", accidentFree: "Accident-free",
  };
  const brand = asset.brand || specification.brand || specification.brandBuilder || asset.builder;
  const model = specification.model || specification.variant || asset.variant;
  const year = specification.yearOfConstruction || specification.year;
  const location = asset.location || specification.carLocation || specification.yachtLocation || specification.city;
  const purpose = asset.type === "Rent" ? "for rent" : "for sale";
  const brandName = String(brand || "").trim();
  const modelName = String(model || "").trim();
  const brandAndModel = [
    brandName && modelName.toLowerCase().startsWith(brandName.toLowerCase()) ? null : brandName,
    modelName,
  ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  const searchName = brandAndModel
    ? `${year && !brandAndModel.includes(String(year)) ? `${year} ` : ""}${brandAndModel}`
    : asset.title;
  const title = `${searchName}${asset.type === "Rent" ? " for rent" : " for sale"}${location ? ` in ${location}` : ""} | Otulia`;
  const price = Number(asset.price);
  const hasPrice = asset.type !== "Rent" && asset.isPriceOnRequest !== true && Number.isFinite(price) && price > 0;
  const summary = [
    `${searchName} ${purpose}${location ? ` in ${location}` : ""}.`,
    year && !searchName.includes(String(year)) ? `Year: ${year}.` : null,
    asset.isPriceOnRequest ? "Price on request." : hasPrice ? `Price: USD ${price.toLocaleString("en-US")}.` : null,
    String(asset.description || "").replace(/\s+/g, " ").trim(),
  ].filter(Boolean).join(" ").slice(0, 300);
  const additionalProperties = Object.entries({ ...specification, ...(asset.keySpecifications || {}) })
    .filter(([key, value]) => publicSpecificationLabels[key] && (typeof value === "string" || typeof value === "number") && String(value).trim())
    .map(([key, value]) => ({ name: publicSpecificationLabels[key], value: String(value).trim() }));
  const images = (Array.isArray(asset.images) ? asset.images : [])
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => {
      try { return new URL(value, "https://otulia.com").toString(); } catch { return null; }
    })
    .filter(Boolean);

  return { brand, model, year, location, title, searchName, summary, images, price, hasPrice, additionalProperties };
};

app.get(/^\/asset\/(car|estate|bike|yacht)\/([^/]+)\/?$/i, async (req, res, next) => {
  try {
    const [, categoryRaw, slugRaw] = req.path.match(/^\/asset\/(car|estate|bike|yacht)\/([^/]+)\/?$/i);
    const category = categoryRaw.toLowerCase();
    const slug = decodeURIComponent(slugRaw).toLowerCase();
    const Model = listingModels[category];
    const seoFields = "title description images brand location price isPriceOnRequest status type category variant builder specification keySpecifications agent _id";
    const idSuffix = slug.match(/(?:^|-)([a-f0-9]{24})$/i)?.[1];
    const requestedId = idSuffix || (mongoose.isValidObjectId(slug) ? slug : null);
    let asset = requestedId
      ? await Model.findOne({ _id: requestedId, status: "Active" }).select(seoFields).lean()
      : null;

    if (!asset) {
      // Slugs remove punctuation, including punctuation inside a word (for
      // example, "Provençal" -> "provenal" and "85,650" -> "85650").
      // Allow non-alphanumeric separators between every slug character so
      // older title-only URLs still resolve to their active listing.
      const normalizedSlug = slug.replace(/[^a-z0-9]/g, "");
      const titlePattern = normalizedSlug.split("")
        .map((character) => character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("[^a-z0-9]*");
      const matches = normalizedSlug
        ? await Model.find({ status: "Active", title: { $regex: `^[^a-z0-9]*${titlePattern}[^a-z0-9]*$`, $options: "i" } })
          .select(seoFields).sort({ _id: 1 }).lean()
        : [];
      asset = matches.find((candidate) => assetSlug(candidate.title) === slug);
    }
    if (!asset) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(404).type("html").send("<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex, nofollow\"><title>Listing not found | Otulia</title></head><body><main><h1>Listing not found</h1><p>This listing is no longer available.</p><a href=\"/shop\">Browse active listings</a></main></body></html>");
    }

    const seo = assetSeoDetails(asset);
    const title = seo.title;
    const description = seo.summary || `Explore ${asset.title} on Otulia, the luxury marketplace.`;
    const image = socialPreviewImage(seo.images[0]) || "https://otulia.com/images/exclusive_club_bg.jpg";
    const canonicalSlug = assetSlug(asset.title, asset._id);
    const canonical = `https://otulia.com/asset/${category}/${encodeURIComponent(canonicalSlug || slug)}`;
    if (slug !== canonicalSlug) return res.redirect(301, canonical);
    const tags = {
      'property="og:type"': "product",
      'property="og:title"': title,
      'property="og:description"': description,
      'property="og:url"': canonical,
      'property="og:image"': image,
      'property="og:image:secure_url"': image,
      'property="og:image:type"': "image/jpeg",
      'property="og:image:width"': "1200",
      'property="og:image:height"': "630",
      'property="og:image:alt"': `${asset.title}${seo.brand ? ` ${seo.brand}` : ""}${seo.model ? ` ${seo.model}` : ""}`,
      'name="twitter:card"': "summary_large_image",
      'name="twitter:title"': title,
      'name="twitter:description"': description,
      'name="twitter:image"': image,
      'name="twitter:image:alt"': `${asset.title}${seo.brand ? ` ${seo.brand}` : ""}${seo.model ? ` ${seo.model}` : ""}`,
    };
    const indexPath = path.join(distPath, "index.html");
    let html = await fs.promises.readFile(indexPath, "utf8");
    for (const [selector, value] of Object.entries(tags)) {
      const escapedValue = htmlEscape(value);
      const tagPattern = new RegExp(`<meta\\s+(?:data-static-head\\s+)?${selector}\\s+content="[^"]*"\\s*\\/>`, "i");
      const replacement = `<meta data-static-head ${selector} content="${escapedValue}" />`;
      if (tagPattern.test(html)) {
        html = html.replace(tagPattern, replacement);
      } else {
        html = html.replace("</head>", `${replacement}\n  </head>`);
      }
    }
    if (!/<meta\s+(?:data-static-head\s+)?property="og:url"\s+content="[^"]*"\s*\/>/i.test(html)) {
      html = html.replace("</head>", `<meta data-static-head property="og:url" content="${htmlEscape(canonical)}" />\n  </head>`);
    }
    html = html.replace(/<title data-static-head>[^<]*<\/title>/i, `<title data-static-head>${htmlEscape(title)}</title>`);
    html = html.replace(/<meta\s+(?:data-static-head\s+)?name="description"\s+content="[^"]*"\s*\/>/i, `<meta data-static-head name="description" content="${htmlEscape(description)}" />`);
    html = html.replace(/<link\s+rel="canonical"[^>]*>/i, "");
    html = html.replace("</head>", `<link data-static-head rel="canonical" href="${htmlEscape(canonical)}" />\n  </head>`);

    const productSchema = seo.hasPrice && seo.images.length ? {
      "@context": "https://schema.org",
      "@type": "Product",
      name: seo.searchName,
      description: String(asset.description || description).replace(/\s+/g, " ").trim().slice(0, 5000),
      image: seo.images,
      sku: String(asset._id),
      category: asset.category || category,
      ...(seo.model ? { model: seo.model } : {}),
      ...(seo.brand ? { brand: { "@type": "Brand", name: seo.brand } } : {}),
      ...(seo.additionalProperties.length ? {
        additionalProperty: seo.additionalProperties.map((property) => ({ "@type": "PropertyValue", ...property })),
      } : {}),
      offers: {
        "@type": "Offer",
        url: canonical,
        price: seo.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        ...(seo.location ? { availableAtOrFrom: { "@type": "Place", name: seo.location } } : {}),
        ...(asset.agent?.company ? { seller: { "@type": "Organization", name: asset.agent.company } } : {}),
      },
    } : null;
    if (productSchema) {
      html = html.replace("</head>", `<script type="application/ld+json">${jsonForHtml(productSchema)}</script>\n  </head>`);
    }

    const fallbackDetails = [
      seo.brand ? `<li><strong>Brand:</strong> ${htmlEscape(seo.brand)}</li>` : "",
      seo.model ? `<li><strong>Model:</strong> ${htmlEscape(seo.model)}</li>` : "",
      seo.year ? `<li><strong>Year:</strong> ${htmlEscape(seo.year)}</li>` : "",
      seo.location ? `<li><strong>Location:</strong> ${htmlEscape(seo.location)}</li>` : "",
      asset.isPriceOnRequest ? "<li><strong>Price:</strong> Price on request</li>" : seo.hasPrice ? `<li><strong>Price:</strong> USD ${htmlEscape(seo.price.toLocaleString("en-US"))}</li>` : "",
      ...seo.additionalProperties.map(({ name, value }) => `<li><strong>${htmlEscape(name)}:</strong> ${htmlEscape(value)}</li>`),
    ].filter(Boolean).join("");
    const fallbackImage = seo.images[0]
      ? `<img src="${htmlEscape(seo.images[0])}" alt="${htmlEscape(`${asset.title}${seo.brand ? ` ${seo.brand}` : ""}${seo.model ? ` ${seo.model}` : ""}`)}" style="max-width:100%;height:auto">`
      : "";
    const listingHtml = `<main style="font-family:Arial,sans-serif;max-width:900px;margin:32px auto;padding:0 20px"><h1>${htmlEscape(title.replace(/ \| Otulia$/, ""))}</h1>${fallbackImage}<p>${htmlEscape(String(asset.description || "").replace(/\s+/g, " ").trim())}</p><ul>${fallbackDetails}</ul><p><a href="${htmlEscape(canonical)}">View this ${htmlEscape(category)} listing on Otulia</a></p></main>`;
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, "");
    html = html.replace('<div id="root"></div>', `<div id="root"><div data-seo-fallback>${listingHtml}</div></div>`);
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
    return res.type("html").send(html);
  } catch (error) {
    console.error("Listing SEO HTML error:", error);
    return res.status(503).type("html").send("<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex\"><title>Listing temporarily unavailable | Otulia</title></head><body><h1>Listing temporarily unavailable</h1></body></html>");
  }
});

// Render ranking content into the initial HTML so crawlers and link-preview
// clients can read the entries without executing the React application.
app.get(/^\/ranking\/([^/]+)\/([^/]+)\/?$/i, async (req, res) => {
  try {
    const [, categoryParam, slugParam] = req.path.match(/^\/ranking\/([^/]+)\/([^/]+)\/?$/i);
    const slug = decodeURIComponent(slugParam).toLowerCase();
    const category = await RankingCategory.findOne({ slug, status: "Active" })
      .populate("assetNominees")
      .populate("dealerNominees");

    if (!category) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(404).type("html").send("<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex, nofollow\"><title>Ranking not found | Otulia</title></head><body><main><h1>Ranking not found</h1><a href=\"/ranking\">Browse Otulia rankings</a></main></body></html>");
    }

    const categoryPath = category.type.toLowerCase().replace(/\s+/g, "").replace(/contentcreator/i, "contentcreators");
    const canonical = `https://otulia.com/ranking/${categoryPath}/${encodeURIComponent(category.slug)}`;
    if (categoryParam.toLowerCase() !== categoryPath) return res.redirect(301, canonical);

    const nominees = category.targetType === "Assets" ? category.assetNominees : category.dealerNominees;
    const rankedNominees = [...(nominees || [])]
      .sort((a, b) => ((b.votes || 0) + (b.fakeVotes || 0)) - ((a.votes || 0) + (a.fakeVotes || 0)))
      .map((nominee, index) => ({
        name: nominee.name,
        image: nominee.image || nominee.profilePic || nominee.avatar || "",
        description: nominee.description || nominee.detail || "",
        brand: nominee.brand || "",
        model: nominee.model || "",
        listingLink: nominee.listingLink || "",
        keyDetails: nominee.keyDetails || {},
        rank: index + 1,
      }));

    const title = `${category.title} | Otulia Rankings`;
    const description = String(category.shortDescription || category.detailedDescription || `Explore Otulia's ${category.title.toLowerCase()} and see how they rank.`)
      .replace(/\s+/g, " ").trim().slice(0, 300);
    const socialImage = publicUrl(category.bannerImage || category.categoryImage || rankedNominees.find((nominee) => nominee.image)?.image) || "https://otulia.com/images/exclusive_club_bg.jpg";
    const indexPath = path.join(distPath, "index.html");
    let html = await fs.promises.readFile(indexPath, "utf8");
    html = html.replace(/<title data-static-head>[^<]*<\/title>/i, `<title data-static-head>${htmlEscape(title)}</title>`);
    html = html.replace(/<meta\s+(?:data-static-head\s+)?name="description"\s+content="[^"]*"\s*\/>/i, `<meta data-static-head name="description" content="${htmlEscape(description)}" />`);
    html = html.replace(/<link\s+rel="canonical"[^>]*>/i, "");
    const rankingMeta = {
      'property="og:type"': "article",
      'property="og:title"': title,
      'property="og:description"': description,
      'property="og:url"': canonical,
      'property="og:image"': socialImage,
      'property="og:image:alt"': category.title,
      'name="twitter:title"': title,
      'name="twitter:description"': description,
      'name="twitter:image"': socialImage,
      'name="twitter:image:alt"': category.title,
    };
    for (const [selector, value] of Object.entries(rankingMeta)) {
      const pattern = new RegExp(`<meta\\s+(?:data-static-head\\s+)?${selector}\\s+content="[^"]*"\\s*\\/>`, "i");
      const replacement = `<meta data-static-head ${selector} content="${htmlEscape(value)}" />`;
      if (pattern.test(html)) html = html.replace(pattern, replacement);
      else html = html.replace("</head>", `${replacement}\n  </head>`);
    }
    html = html.replace("</head>", `<link data-static-head rel="canonical" href="${htmlEscape(canonical)}" />\n  </head>`);

    const entries = rankedNominees.map((nominee) => {
      const name = [nominee.brand, nominee.model].filter((part) => part && !nominee.name.toLowerCase().includes(part.toLowerCase())).join(" ");
      const displayName = name ? `${nominee.name} (${name})` : nominee.name;
      const imageUrl = publicUrl(nominee.image);
      const image = imageUrl ? `<img src="${htmlEscape(imageUrl)}" alt="${htmlEscape(displayName)}" style="max-width:240px;height:auto">` : "";
      const details = Object.entries(nominee.keyDetails)
        .filter(([, value]) => ["string", "number"].includes(typeof value) && String(value).trim())
        .map(([key, value]) => `<li><strong>${htmlEscape(key.replace(/([A-Z])/g, " $1"))}:</strong> ${htmlEscape(value)}</li>`)
        .join("");
      const link = /^https?:\/\//i.test(nominee.listingLink) || nominee.listingLink.startsWith("/")
        ? `<p><a href="${htmlEscape(nominee.listingLink.startsWith("/") ? new URL(nominee.listingLink, "https://otulia.com").toString() : nominee.listingLink)}">View listing</a></p>`
        : "";
      return `<article><h2>${nominee.rank}. ${htmlEscape(displayName)}</h2>${image}${nominee.description ? `<p>${htmlEscape(nominee.description)}</p>` : ""}${details ? `<ul>${details}</ul>` : ""}${link}</article>`;
    }).join("");
    const renderedContent = `<main style="font-family:Arial,sans-serif;max-width:900px;margin:32px auto;padding:0 20px"><h1>${htmlEscape(category.title)}</h1><p>${htmlEscape(description)}</p>${entries || "<p>No ranked entries are currently available.</p>"}<p><a href="/ranking">Browse all Otulia rankings</a></p></main>`;
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, "");
    html = html.replace('<div id="root"></div>', `<div id="root"><div data-seo-fallback>${renderedContent}</div></div>`);

    if (rankedNominees.length) {
      const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: category.title,
        description,
        url: canonical,
        numberOfItems: rankedNominees.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: rankedNominees.map((nominee) => ({
          "@type": "ListItem",
          position: nominee.rank,
          name: nominee.name,
          ...(publicUrl(nominee.image) ? { image: publicUrl(nominee.image) } : {}),
          ...(nominee.description ? { description: nominee.description } : {}),
          ...(publicUrl(nominee.listingLink) ? { url: publicUrl(nominee.listingLink) } : {}),
        })),
      };
      html = html.replace("</head>", `<script type="application/ld+json">${jsonForHtml(itemList)}</script>\n  </head>`);
    }

    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
    return res.type("html").send(html);
  } catch (error) {
    console.error("Ranking SEO HTML error:", error);
    return res.status(503).type("html").send("<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex\"><title>Ranking temporarily unavailable | Otulia</title></head><body><h1>Ranking temporarily unavailable</h1></body></html>");
  }
});

// Public collection and information pages also need useful first-response HTML.
// Authenticated/account routes intentionally stay on the app shell and remain noindex.
const publicPageDetails = {
  "/": ["Luxury Cars, Real Estate & Yachts for Sale | Otulia", "Discover luxury cars, real estate, yachts and bikes for sale from dealers and private sellers around the world."],
  "/shop": ["Buy Luxury Cars, Real Estate & More | Otulia", "Browse luxury cars, estates, yachts and bikes for sale on Otulia."],
  "/rent": ["Rent Luxury Cars, Estates & Yachts | Otulia", "Explore luxury cars, estates, yachts and bikes available to rent through Otulia."],
  "/community": ["Otulia Luxury Community", "Explore the Otulia community for luxury asset owners, buyers and enthusiasts."],
  "/seller": ["Sell Luxury Assets on Otulia", "Reach a global audience of qualified buyers for your luxury cars, real estate, yachts and bikes."],
  "/sellwithus": ["Sell With Otulia", "List your luxury asset with Otulia and connect with buyers around the world."],
  "/pricing": ["Otulia Seller Plans & Pricing", "Compare Otulia plans for dealers and private sellers listing luxury assets."],
  "/about": ["About Otulia", "Otulia is a global marketplace for luxury cars, real estate, yachts and bikes."],
  "/reviews": ["Otulia Reviews", "Read buyer and seller experiences with the Otulia luxury marketplace."],
  "/faq": ["Otulia Frequently Asked Questions", "Answers about buying, selling and renting luxury assets through Otulia."],
  "/blogs": ["Luxury Market News & Stories | Otulia", "Read the latest luxury automotive, real estate and lifestyle stories from Otulia."],
  "/journal": ["Otulia Journal | Luxury Market Guides & Stories", "Explore practical guides and editorial stories about luxury cars, real estate and ownership."],
  "/terms": ["Terms of Use | Otulia", "Review the terms that apply when using the Otulia marketplace."],
  "/privacy-policy": ["Privacy Policy | Otulia", "Learn how Otulia collects, uses and protects personal information."],
  "/shipping": ["Shipping Information | Otulia", "Information about coordinating delivery for assets purchased through Otulia."],
  "/returns": ["Returns Policy | Otulia", "Review Otulia's returns and cancellation information."],
  "/cookie-policy": ["Cookie Policy | Otulia", "Learn how Otulia uses cookies and similar technologies."],
  "/contact": ["Contact Otulia", "Contact Otulia about luxury listings, buying, selling or marketplace support."],
};

const safePattern = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const formatListingPrice = (asset) => asset.isPriceOnRequest
  ? "Price on request"
  : Number.isFinite(Number(asset.price)) && Number(asset.price) > 0
    ? `USD ${Number(asset.price).toLocaleString("en-US")}`
    : "Contact for price";

const readJournalMetadata = (slug) => {
  const sourcePath = path.join(__dirname, "../client/src/data/journalArticles.js");
  if (!fs.existsSync(sourcePath)) return null;
  const source = fs.readFileSync(sourcePath, "utf8");
  const key = `"${slug}":`;
  const start = source.indexOf(key);
  if (start < 0) return null;
  const block = source.slice(start, start + 3000);
  const titleMatch = block.match(/title:\s*([\s\S]*?),\s*description:/);
  const descriptionMatch = block.match(/description:\s*([\s\S]*?)\s*\n\s*},?/);
  const literals = (expression) => expression?.match(/(['"])(?:\\.|(?!\1)[\s\S])*?\1/g)
    ?.map((literal) => literal.slice(1, -1).replace(/\\(['"\\])/g, "$1")).join("") || "";
  const title = literals(titleMatch?.[1]);
  const description = literals(descriptionMatch?.[1]);
  return title && description ? { title, description } : null;
};

const renderPublicPage = async (req, res, { title, description, canonical, assets = [], extraContent = "", noindex = false }) => {
  const indexPath = path.join(distPath, "index.html");
  let html = await fs.promises.readFile(indexPath, "utf8");
  html = html.replace(/<title data-static-head>[^<]*<\/title>/i, `<title data-static-head>${htmlEscape(title)}</title>`);
  html = html.replace(/<meta\s+(?:data-static-head\s+)?name="description"\s+content="[^"]*"\s*\/>/i, `<meta data-static-head name="description" content="${htmlEscape(description)}" />`);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, "");
  const metadata = {
    'property="og:type"': "website",
    'property="og:title"': title,
    'property="og:description"': description,
    'property="og:url"': canonical,
    'property="og:image"': publicUrl(assets.find((asset) => asset.images?.[0])?.images?.[0]) || "https://otulia.com/images/exclusive_club_bg.jpg",
    'property="og:image:alt"': assets[0]?.title || "Otulia luxury marketplace",
    'name="twitter:title"': title,
    'name="twitter:description"': description,
    'name="twitter:image"': publicUrl(assets.find((asset) => asset.images?.[0])?.images?.[0]) || "https://otulia.com/images/exclusive_club_bg.jpg",
    'name="twitter:image:alt"': assets[0]?.title || "Otulia luxury marketplace",
  };
  for (const [selector, value] of Object.entries(metadata)) {
    const pattern = new RegExp(`<meta\\s+(?:data-static-head\\s+)?${selector}\\s+content="[^"]*"\\s*\\/>`, "i");
    const replacement = `<meta data-static-head ${selector} content="${htmlEscape(value)}" />`;
    if (pattern.test(html)) html = html.replace(pattern, replacement);
    else html = html.replace("</head>", `${replacement}\n  </head>`);
  }
  html = html.replace(/<meta\s+(?:data-static-head\s+)?name="robots"\s+content="[^"]*"\s*\/>/i,
    `<meta data-static-head name="robots" content="${noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`);
  html = html.replace("</head>", `<link data-static-head rel="canonical" href="${htmlEscape(canonical)}" />\n  </head>`);

  const cards = assets.map((asset) => {
    const category = asset.categoryPath;
    const href = `/asset/${category}/${encodeURIComponent(assetSlug(asset.title, asset._id) || asset._id)}`;
    const image = publicUrl(asset.images?.[0]);
    const imageHtml = image ? `<img src="${htmlEscape(image)}" alt="${htmlEscape(`${asset.title}${asset.brand ? ` ${asset.brand}` : ""}`)}" style="max-width:260px;height:auto">` : "";
    const location = asset.location ? `<p>${htmlEscape(asset.location)}</p>` : "";
    return `<article><h2><a href="${htmlEscape(href)}">${htmlEscape(asset.title)}</a></h2>${imageHtml}${asset.brand ? `<p>${htmlEscape(asset.brand)}</p>` : ""}${location}<p>${htmlEscape(formatListingPrice(asset))}</p><p>${htmlEscape(String(asset.description || "").replace(/\s+/g, " ").trim().slice(0, 450))}</p></article>`;
  }).join("");
  const categoryLinks = [
    ["Cars for sale", "/category/cars"], ["Luxury real estate", "/category/estates"],
    ["Yachts", "/category/yachts"], ["Bikes", "/category/bikes"],
    ["Rentals", "/rent"], ["Otulia Journal", "/journal"], ["Rankings", "/ranking"],
  ].map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("");
  const main = `<main style="font-family:Arial,sans-serif;max-width:1100px;margin:32px auto;padding:0 20px"><h1>${htmlEscape(title.replace(/\s*\|\s*Otulia(?: Journal| Rankings)?$/, ""))}</h1><p>${htmlEscape(description)}</p>${extraContent}${assets.length ? `<section><h2>Featured listings</h2>${cards}</section>` : ""}<nav aria-label="Explore Otulia"><h2>Explore Otulia</h2><ul>${categoryLinks}</ul></nav></main>`;
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, "");
  html = html.replace('<div id="root"></div>', `<div id="root"><div data-seo-fallback>${main}</div></div>`);
  if (assets.length) {
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: title,
      description,
      url: canonical,
      numberOfItems: assets.length,
      itemListElement: assets.map((asset, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: asset.title,
        url: `https://otulia.com/asset/${asset.categoryPath}/${encodeURIComponent(assetSlug(asset.title, asset._id) || asset._id)}`,
        ...(publicUrl(asset.images?.[0]) ? { image: publicUrl(asset.images[0]) } : {}),
      })),
    };
    html = html.replace("</head>", `<script type="application/ld+json">${jsonForHtml(itemList)}</script>\n  </head>`);
  }
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  return res.type("html").send(html);
};

app.get(/^\/(?:$|shop|rent|community|seller|sellwithus|pricing|about|reviews|faq|blogs|journal|terms|privacy-policy|shipping|returns|cookie-policy|contact|category\/(?:cars|estates|yachts|bikes)|ranking(?:\/(?:cars|realestate|yachts|bikes|contentcreators))?)\/?$/i, async (req, res, next) => {
  try {
    const route = req.path.replace(/\/$/, "") || "/";
    let title = publicPageDetails[route]?.[0];
    let description = publicPageDetails[route]?.[1];
    const isCategory = route.startsWith("/category/");
    const categoryName = isCategory ? route.split("/")[2] : "";
    if (isCategory) {
      const label = { cars: "Cars", estates: "Luxury Real Estate", yachts: "Yachts", bikes: "Bikes" }[categoryName];
      title = `${label} for Sale | Otulia`;
      description = `Browse luxury ${label.toLowerCase()} for sale from verified dealers and private sellers on Otulia.`;
    }
    if (route.startsWith("/ranking")) {
      title ||= "Luxury Asset Rankings | Otulia";
      description ||= "Explore Otulia rankings of standout luxury cars, real estate, yachts and other assets.";
    }
    const assets = [];
    const modelEntries = Object.entries(listingModels);
    for (const [category, Model] of modelEntries) {
      if (isCategory && !({ cars: "car", estates: "estate", yachts: "yacht", bikes: "bike" }[categoryName] === category)) continue;
      if (!isCategory && !["/shop", "/rent"].includes(route)) continue;
      let filter = { status: "Active", type: route === "/rent" ? "Rent" : "Sale" };
      const records = await Model.find(filter).select("title description images brand location price isPriceOnRequest type updatedAt").sort({ updatedAt: -1 }).limit(12).lean();
      assets.push(...records.map((asset) => ({ ...asset, categoryPath: category })));
    }
    if (route === "/") {
      title = publicPageDetails["/"][0];
      description = publicPageDetails["/"][1];
      assets.splice(0, assets.length);
      for (const [category, Model] of modelEntries) {
        const records = await Model.find({ status: "Active", type: "Sale" }).select("title description images brand location price isPriceOnRequest type updatedAt").sort({ updatedAt: -1 }).limit(3).lean();
        assets.push(...records.map((asset) => ({ ...asset, categoryPath: category })));
      }
    }
    let extraContent = "";
    if (route.startsWith("/ranking")) {
      const categories = await RankingCategory.find({ status: "Active" }).select("title slug type shortDescription categoryImage bannerImage").sort({ displayOrder: 1 }).lean();
      extraContent = `<section><h2>Explore ranking categories</h2>${categories.map((item) => {
        const category = item.type.toLowerCase().replace(/\s+/g, "").replace(/contentcreator/i, "contentcreators");
        return `<article><h3><a href="/ranking/${encodeURIComponent(category)}/${encodeURIComponent(item.slug)}">${htmlEscape(item.title)}</a></h3><p>${htmlEscape(item.shortDescription || "Explore this Otulia ranking.")}</p></article>`;
      }).join("")}</section>`;
    }
    if (route === "/journal") {
      const articles = [
        ["the-true-cost-of-owning-a-luxurycar", "The True Cost of Owning a Luxury Car", "Understand depreciation, insurance and maintenance costs."],
        ["how-to-verify-a-luxury-car-history-and-authenticity-before-you-buy", "How to Verify a Luxury Car's History and Authenticity", "A guide to checking a luxury car before buying."],
        ["how-to-stage-a-luxury-home-to-sell-faster", "How to Stage a Luxury Home to Sell Faster", "Practical ideas for presenting a luxury property."],
        ["luxury-real-estate-trends-2026-what-buyers-and-sellers-need-to-know", "Luxury Real Estate Trends 2026", "What buyers and sellers should know about the luxury property market."],
        ["jumbo-loans-explained-what-buyers-need-to-know-before-financing-a-luxury-home", "Jumbo Loans Explained", "How jumbo financing works for luxury homes."],
        ["which-exotic-cars-hold-their-value-best-a-guide-to-investment-grade-vehicles", "Which Exotic Cars Hold Their Value Best", "A guide to exotic cars with collector appeal."],
      ];
      extraContent = `<section><h2>Latest guides and stories</h2>${articles.map(([slug, articleTitle, summary]) => `<article><h3><a href="/journal/${slug}">${htmlEscape(articleTitle)}</a></h3><p>${htmlEscape(summary)}</p></article>`).join("")}</section>`;
    }
    const canonical = `https://otulia.com${route}`;
    return renderPublicPage(req, res, { title, description, canonical, assets: assets.slice(0, 12), extraContent });
  } catch (error) {
    console.error("Public page HTML error:", error);
    return next(error);
  }
});

app.get(/^\/journal\/([^/]+)\/?$/i, async (req, res, next) => {
  const slug = req.path.match(/^\/journal\/([^/]+)\/?$/i)?.[1]?.toLowerCase();
  const article = slug ? readJournalMetadata(slug) : null;
  if (!article) return next();
  try {
    const title = `${article.title} | Otulia Journal`;
    const canonical = `https://otulia.com/journal/${encodeURIComponent(slug)}`;
    return renderPublicPage(req, res, { title, description: article.description, canonical });
  } catch (error) {
    console.error("Journal article HTML error:", error);
    return next(error);
  }
});

app.get(/^\/dealer\/([^/]+)\/?$/i, async (req, res, next) => {
  try {
    const email = decodeURIComponent(req.path.match(/^\/dealer\/([^/]+)\/?$/i)[1]).toLowerCase();
    const user = await User.findOne({ email }).select("name company profilePicture plan agentDescription createdAt").lean();
    const listingModelsForProfile = [
      ["car", CarAsset], ["estate", EstateAsset], ["bike", BikeAsset], ["yacht", YachtAsset],
      ["", Listing],
    ];
    const matches = await Promise.all(listingModelsForProfile.map(async ([category, Model]) => {
      const records = await Model.find({ status: "Active", $or: [{ ownerEmail: email }, { "agent.email": email }] })
        .select("title description images brand location price isPriceOnRequest type category updatedAt")
        .sort({ updatedAt: -1 }).limit(20).lean();
      return records.map((record) => ({
        ...record,
        categoryPath: category || String(record.category || "car").toLowerCase().replace(/s$/, ""),
      }));
    }));
    const assets = matches.flat();
    if (!user && !assets.length) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(404).type("html").send("<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex, nofollow\"><title>Dealer not found | Otulia</title></head><body><main><h1>Dealer not found</h1></main></body></html>");
    }
    const name = user?.company?.companyName || user?.name || assets[0]?.agent?.company || "Luxury Asset Dealer";
    const description = String(user?.company?.description || user?.agentDescription || `Explore current luxury listings from ${name} on Otulia.`).replace(/\s+/g, " ").trim().slice(0, 300);
    const title = `${name} | Luxury Listings on Otulia`;
    return renderPublicPage(req, res, { title, description, canonical: `https://otulia.com/dealer/${encodeURIComponent(email)}`, assets: assets.slice(0, 20) });
  } catch (error) {
    console.error("Dealer profile HTML error:", error);
    return next(error);
  }
});

// Public brand and location landing pages show matching active inventory in the
// first response; this covers every /listings/:topic route from the public site.
app.get(/^\/listings\/([^/]+)\/?$/i, async (req, res, next) => {
  try {
    const topic = decodeURIComponent(req.path.match(/^\/listings\/([^/]+)\/?$/i)[1]).toLowerCase();
    const words = topic.replace(/-/g, " ");
    const expression = new RegExp(safePattern(words), "i");
    const assets = [];
    for (const [category, Model] of Object.entries(listingModels)) {
      const matches = await Model.find({
        status: "Active",
        type: "Sale",
        $or: [{ title: expression }, { brand: expression }, { location: expression }, { "specification.city": expression }, { "specification.country": expression }],
      }).select("title description images brand location price isPriceOnRequest type updatedAt").sort({ updatedAt: -1 }).limit(20).lean();
      assets.push(...matches.map((asset) => ({ ...asset, categoryPath: category })));
    }
    const label = words.replace(/\b\w/g, (letter) => letter.toUpperCase());
    const title = `${label} Luxury Listings for Sale | Otulia`;
    const description = `Explore luxury cars and properties in ${label}, including active listings from dealers and private sellers on Otulia.`;
    if (!assets.length) {
      res.setHeader("X-Robots-Tag", "noindex, follow");
      return renderPublicPage(req, res, { title, description, canonical: `https://otulia.com/listings/${topic}`, noindex: true });
    }
    return renderPublicPage(req, res, { title, description, canonical: `https://otulia.com/listings/${topic}`, assets: assets.slice(0, 20) });
  } catch (error) {
    console.error("Listing collection HTML error:", error);
    return next(error);
  }
});

app.get(/^\/(?:login|signup|cart|profile|success|inventory|favorites|admin|content-management|listings)(?:\/.*)?$/i, async (req, res) => {
  const route = req.path.split("/").filter(Boolean)[0] || "account";
  const labels = {
    login: ["Sign in to Otulia", "Sign in to manage your Otulia account."],
    signup: ["Create an Otulia Account", "Create an account to save listings and manage your marketplace activity."],
    cart: ["Your Otulia Cart", "Review items saved to your cart."],
    profile: ["Your Otulia Profile", "Manage your account profile and preferences."],
    success: ["Transaction Complete | Otulia", "Your Otulia transaction has been processed."],
    inventory: ["Your Inventory | Otulia", "Manage your active luxury listings."],
    favorites: ["Your Favorites | Otulia", "View your saved luxury listings."],
    admin: ["Otulia Administration", "Administrative tools for Otulia."],
    "content-management": ["Otulia Content Management", "Manage Otulia website content."],
    listings: ["Your Listings | Otulia", "Manage listings associated with your Otulia account."],
  };
  const [title, description] = labels[route] || ["Account | Otulia", "Manage your Otulia account."];
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  return renderPublicPage(req, res, { title, description, canonical: `https://otulia.com${req.path}`, noindex: true });
});

const PORT = process.env.PORT || 5000;

const distPath = path.join(__dirname, "../client/dist");
console.log(`[Static] Serving files from: ${distPath}`);

// Diagnostic: Check if dist exists
if (fs.existsSync(distPath)) {
  console.log(
    `[Static] dist folder found. Contents:`,
    fs.readdirSync(distPath),
  );
  const assetsPath = path.join(distPath, "assets");
  if (fs.existsSync(assetsPath)) {
    console.log(
      `[Static] assets folder found. Example files:`,
      fs.readdirSync(assetsPath).slice(0, 5),
    );
  } else {
    console.warn(`[Static] WARNING: assets folder NOT found at ${assetsPath}`);
  }
} else {
  console.error(`[Static] ERROR: dist folder NOT found at ${distPath}`);
}

// Case-insensitive asset resolver fallback (handles Linux case-sensitivity and cached lowercase redirects)
app.use("/assets", (req, res, next) => {
  const assetsDir = path.join(distPath, "assets");
  const requestedFile = req.path.replace(/^\//, "");

  if (fs.existsSync(path.join(assetsDir, requestedFile))) {
    return next();
  }

  try {
    if (fs.existsSync(assetsDir)) {
      const lowerName = requestedFile.toLowerCase();
      const files = fs.readdirSync(assetsDir);
      const matched = files.find((f) => f.toLowerCase() === lowerName);
      if (matched) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.sendFile(path.join(assetsDir, matched));
      }
    }
  } catch (err) {
    console.error("[Assets Fallback Error]", err);
  }
  next();
});

app.use(
  express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        );
      } else if (
        filePath.match(
          /\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$/,
        )
      ) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

// routes register
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/listings", createListingRoutes); // Routes: /create, /delete/:id
app.use("/api/listings", listingRoutes); // Routes: /:id
app.use("/api/assets", assetsRoutes);
app.use("/api/test", require("./routes/test.routes.js"));
app.use("/api/trending", trendingRoutes);
app.use("/api/popular", popularRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", require("./routes/admin.routes.js"));
app.use("/api/car-ranking", carRankingRoutes);
app.use("/api/rankings", require("./routes/rankings.routes.js"));
app.use("/api/blog", require("./routes/blog.routes.js"));

const startTime = new Date().toISOString();

app.get("/api/debug-assets", (req, res) => {
  const distPath = path.join(__dirname, "../client/dist");
  const results = {
    distExists: fs.existsSync(distPath),
    distContents: fs.existsSync(distPath) ? fs.readdirSync(distPath) : [],
    assetsPath: path.join(distPath, "assets"),
    assetsContents: [],
  };

  if (fs.existsSync(results.assetsPath)) {
    results.assetsContents = fs.readdirSync(results.assetsPath).slice(0, 20); // First 20 files
  }

  res.json(results);
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Otulia Backend",
    deployedAt: startTime,
    version: "1.0.1-diagnostic",
  });
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), { maxAge: "1y" }),
);

const clientRoutes = new Set([
  "/",
  "/shop",
  "/community",
  "/rent",
  "/seller",
  "/cart",
  "/pricing",
  "/blogs",
  "/ranking",
  "/journal",
  "/login",
  "/signup",
  "/about",
  "/reviews",
  "/faq",
  "/profile",
  "/success",
  "/listings",
  "/inventory",
  "/favorites",
  "/admin",
  "/admin/view-document",
  "/content-management",
  "/sellwithus",
  "/terms",
  "/privacy-policy",
  "/shipping",
  "/returns",
  "/cookie-policy",
  "/contact",
  "/listings/private-islands",
  "/listings/balearic-islands",
  "/listings/costa-del-sol",
  "/listings/french-riviera",
  "/listings/tuscany",
  "/listings/amsterdam",
  "/listings/atlanta",
  "/listings/austin",
  "/listings/benahavis",
  "/listings/beverly-hills",
  "/listings/australia",
  "/listings/british-virgin-islands",
  "/listings/canada",
  "/listings/cayman-islands",
  "/listings/france",
  "/listings/germany",
  "/listings/greece",
  "/listings/india",
  "/listings/ireland",
  "/listings/monaco",
  "/listings/ferrari",
  "/listings/aston-martin",
  "/listings/koenigsegg",
  "/listings/lamborghini",
  "/listings/bugatti",
  "/listings/maserati",
  "/listings/pagani",
  "/listings/porsche",
  "/listings/rolls-royce",
  "/listings/bugatti-chiron",
]);

const isClientRoute = (requestPath) =>
  clientRoutes.has(requestPath) ||
  /^\/category\/(cars|estates|yachts|bikes)$/.test(requestPath) ||
  /^\/asset\/(car|estate|bike|yacht)\/[^/]+$/.test(requestPath) ||
  /^\/journal\/[^/]+$/.test(requestPath) ||
  /^\/ranking\/[^/]+(?:\/[^/]+)?$/.test(requestPath) ||
  /^\/dealer\/[^/]+$/.test(requestPath);

app.use((req, res) => {
  // If the request has a file extension (like .js, .css, .png) or is an API route, return 404
  if (
    req.path.startsWith("/api/") ||
    (req.path.match(/\.[^\/]+$/) && !isClientRoute(req.path))
  ) {
    res.status(404).send("File not found");
  } else {
    // Prevent caching for the entry point
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );

    // Determine index.html location with fallbacks
    const candidatePaths = [
      path.join(__dirname, "../client/dist/index.html"),
      path.join(process.cwd(), "client/dist/index.html"),
      path.join(process.cwd(), "dist/index.html"),
    ];

    const indexPath =
      candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0];

    if (!isClientRoute(req.path)) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.status(404);
    }

    // Serve the React app index.html for client-side routing
    res.sendFile(indexPath, (err) => {
      if (err && !res.headersSent) {
        console.error(
          `[SPA Error] Failed to serve index.html from ${indexPath}:`,
          err,
        );
        res.status(500).json({
          error: "INDEX_HTML_NOT_FOUND",
          message:
            "Client build index.html not found. Please ensure 'npm run build' has been run.",
        });
      }
    });
  }
});

const multer = require("multer");

// Global Error Handler for Multer and other specific errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      console.error(`[Multer Error] File too large: ${err.message}`);
      return res.status(400).json({
        error: "FILE_TOO_LARGE",
        message:
          "One or more files are too large. Maximum allowed size per file is 5MB.",
      });
    }
    console.error(
      `[Multer Error] ${err.code}: ${err.message}${err.field ? ` (field: ${err.field})` : ""}`,
    );
    return res.status(400).json({
      error: "UPLOAD_ERROR",
      message: `${err.message}${err.field ? ` (field: ${err.field})` : ""}`,
    });
  }

  // Generic error fallback
  console.error(`[Internal Error]`, err);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
