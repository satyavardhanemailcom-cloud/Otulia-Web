import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, name = 'Otulia', type = 'website', image, url, productData }) {
  const defaultDescription = 'The premier destination for buying and selling editorial-grade luxury cars, yachts, estates, and bikes. Explore exclusive global listings.';
  const defaultKeywords = 'luxury assets, luxury cars, yachts for sale, luxury real estate, exclusive bikes, otulia, buy luxury assets, sell luxury assets';
  const defaultImage = 'https://otulia.com/images/exclusive_club_bg.jpg';
  const defaultUrl = 'https://otulia.com';

  const seoTitle = title ? `${title} | Otulia` : 'Otulia - Buy & Sell Luxury Assets Worldwide';

  // Standard Organization Schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Otulia",
    "url": defaultUrl,
    "logo": "https://otulia.com/logos/logo.png",
    "sameAs": [
      "https://facebook.com/otulia",
      "https://instagram.com/otulia",
      "https://twitter.com/otulia"
    ]
  };

  // Product Schema for Assets
  let productSchema = null;
  if (productData) {
    productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": productData.title,
      "description": productData.description || description || defaultDescription,
      "image": productData.images || [image || defaultImage],
      "sku": productData._id,
      "brand": {
        "@type": "Brand",
        "name": productData.brand || "Luxury Asset"
      },
      "offers": {
        "@type": "Offer",
        "url": url || (defaultUrl + window.location.pathname),
        "priceCurrency": "USD",
        "price": productData.price || "0",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/UsedCondition"
      }
    };
  }

  const navSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "SiteNavigationElement", "position": 1, "name": "Shop", "url": `${defaultUrl}/shop` },
      { "@type": "SiteNavigationElement", "position": 2, "name": "Explore", "url": `${defaultUrl}/#Category` },
      { "@type": "SiteNavigationElement", "position": 3, "name": "About Us", "url": `${defaultUrl}/about` },
      { "@type": "SiteNavigationElement", "position": 4, "name": "Login", "url": `${defaultUrl}/login` }
    ]
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url || defaultUrl + window.location.pathname} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(navSchema)}
      </script>
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}

      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={url || defaultUrl + window.location.pathname} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
}
