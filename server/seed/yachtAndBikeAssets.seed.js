require("dotenv").config();
const mongoose = require("mongoose");
const YachtAsset = require("../models/YachtAsset.model");
const BikeAsset = require("../models/BikeAsset.model");

const companyLogos = {
    yacht: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Azimut_Yachts_logo.png/1200px-Azimut_Yachts_logo.png",
    bike: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ducati_red_logo.svg/1200px-Ducati_red_logo.svg.png"
};

const yachts = [
    {
        title: "Azimut Grande 27M",
        description: "The Azimut Grande 27M is a masterpiece of Italian design and engineering, offering unparalleled luxury and performance on the open sea.",
        price: 450000000,
        location: "Monaco",
        images: ["https://images.unsplash.com/photo-1567899834503-457b9285094e?auto=format&fit=crop&q=80&w=2070", "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&q=80&w=2070"],
        brand: "Azimut",
        keySpecifications: { power: "3800 HP", mileage: "27.03m Length", cylinderCapacity: "Twin MAN V12" },
        agent: { name: "Jean-Luc Picard", photo: "https://i.pravatar.cc/150?u=jeanluc", company: "Monaco Yachting Group", companyLogo: companyLogos.yacht, joined: 48 }
    },
    {
        title: "Sunseeker Manhattan 68",
        description: "Experience the ultimate in coastal cruising with the Sunseeker Manhattan 68, featuring spacious interiors and a state-of-the-art flybridge.",
        price: 280000000,
        location: "Miami, FL",
        images: ["https://images.unsplash.com/photo-1621275471769-e6aa344546d5?auto=format&fit=crop&q=80&w=2073", "https://images.unsplash.com/photo-1605281317010-fe5ffe798156?auto=format&fit=crop&q=80&w=2070"],
        brand: "Sunseeker",
        keySpecifications: { power: "2400 HP", mileage: "21.10m Length", cylinderCapacity: "Twin Volvo IPS" },
        agent: { name: "Sarah Jenkins", photo: "https://i.pravatar.cc/150?u=sarah", company: "Miami Luxury Charters", companyLogo: companyLogos.yacht, joined: 24 }
    },
    {
        title: "Princess Y85",
        description: "The Princess Y85 is a triumph of contemporary design. Her elegant architecture and signature craftsmanship deliver an unforgettable experience.",
        price: 320000000,
        location: "London, UK",
        images: ["https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=2070"],
        brand: "Princess",
        keySpecifications: { power: "3800 HP", mileage: "26.2m Length", cylinderCapacity: "Twin MAN V12" },
        agent: { name: "James Bond", photo: "https://i.pravatar.cc/150?u=bond", company: "Q Branch Marine", companyLogo: companyLogos.yacht, joined: 36 }
    },
    {
        title: "Ferretti Yachts 1000",
        description: "The first all-wide-body Ferretti Yachts 1000 is the shipyard's new flagship, a vessel of unprecedented size and luxury.",
        price: 520000000,
        location: "St. Tropez",
        images: ["https://images.unsplash.com/photo-1567899468162-63a130663456?auto=format&fit=crop&q=80&w=2070"],
        brand: "Ferretti",
        keySpecifications: { power: "5200 HP", mileage: "30.13m Length", cylinderCapacity: "Twin MTU" },
        agent: { name: "Antoine Griezmann", photo: "https://i.pravatar.cc/150?u=antoine", company: "French Riviera Marine", companyLogo: companyLogos.yacht, joined: 12 }
    },
    {
        title: "Pershing 8X",
        description: "The Pershing 8X is a masterpiece of speed and luxury, capable of reaching incredible speeds while maintaining absolute comfort.",
        price: 380000000,
        location: "Ibiza",
        images: ["https://images.unsplash.com/photo-1605281317010-fe5ffe798156?auto=format&fit=crop&q=80&w=2070"],
        brand: "Ferretti",
        keySpecifications: { power: "4860 HP", mileage: "25.55m Length", cylinderCapacity: "Twin MTU 16V" },
        agent: { name: "Leo Messi", photo: "https://i.pravatar.cc/150?u=leo", company: "Balearic Luxury", companyLogo: companyLogos.yacht, joined: 18 }
    },
    {
        title: "Benetti Oasis 40M",
        description: "The Benetti Oasis 40M is a revolutionary yacht dedicated to leisure and lifestyle, featuring a unique open stern deck.",
        price: 650000000,
        location: "Portofino",
        images: ["https://images.unsplash.com/photo-1544413647-b51049302bcc?auto=format&fit=crop&q=80&w=1974"],
        brand: "Benetti",
        keySpecifications: { power: "2800 HP", mileage: "40.80m Length", cylinderCapacity: "Twin MAN" },
        agent: { name: "Federico Fellini", photo: "https://i.pravatar.cc/150?u=fed", company: "Italian Maritime", companyLogo: companyLogos.yacht, joined: 60 }
    }
];

const bikes = [
    {
        title: "Ducati Panigale V4 R",
        description: "The Panigale V4 R is a racing bike specialized for the track, bringing the ultimate Ducati experience to the road.",
        price: 4500000,
        location: "Bologna, Italy",
        images: ["https://images.unsplash.com/photo-1558981403-c5f91ebafc08?auto=format&fit=crop&q=80&w=2070", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=2070"],
        brand: "Ducati",
        keySpecifications: { power: "218 HP", mileage: "315 km/h", cylinderCapacity: "998 cc" },
        agent: { name: "Marco Rossi", photo: "https://i.pravatar.cc/150?u=marco", company: "Ducati Bologna", companyLogo: companyLogos.bike, joined: 60 }
    },
    {
        title: "Kawasaki Ninja H2R",
        description: "The world's only supercharged hypersport motorcycle, the Ninja H2R is a feat of engineering destined for track-only dominance.",
        price: 7500000,
        location: "Tokyo, Japan",
        images: ["https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=1974", "https://images.unsplash.com/photo-1614165939023-eb5607b39886?auto=format&fit=crop&q=80&w=1974"],
        brand: "Kawasaki",
        keySpecifications: { power: "310 HP", mileage: "400 km/h", cylinderCapacity: "998 cc" },
        agent: { name: "Kenji Sato", photo: "https://i.pravatar.cc/150?u=kenji", company: "Tokyo Moto Group", companyLogo: companyLogos.bike, joined: 12 }
    },
    {
        title: "BMW M 1000 RR",
        description: "Pure racing technology for the highest performance requirements in motor sports and for the road.",
        price: 3500000,
        location: "Munich, Germany",
        images: ["https://images.unsplash.com/photo-1558363196-8458ef546d17?auto=format&fit=crop&q=80&w=1970"],
        brand: "BMW",
        keySpecifications: { power: "205 HP", mileage: "306 km/h", cylinderCapacity: "999 cc" },
        agent: { name: "Dieter Zetsche", photo: "https://i.pravatar.cc/150?u=dieter", company: "Bavarian Cycles", companyLogo: companyLogos.bike, joined: 72 }
    },
    {
        title: "Yamaha YZF-R1M",
        description: "The R1M is the most advanced production motorcycle ever created by Yamaha, featuring electronic racing suspension.",
        price: 2800000,
        location: "Iwata, Japan",
        images: ["https://images.unsplash.com/photo-1449495169669-7b118f960237?auto=format&fit=crop&q=80&w=2070"],
        brand: "Yamaha",
        keySpecifications: { power: "200 HP", mileage: "299 km/h", cylinderCapacity: "998 cc" },
        agent: { name: "Yoshi Moto", photo: "https://i.pravatar.cc/150?u=yoshi", company: "Yamaha Performance", companyLogo: companyLogos.bike, joined: 24 }
    },
    {
        title: "Aprilia RSV4 Factory",
        description: "The Aprilia RSV4 is a unique motorcycle project that has stayed at the top of the category for over a decade.",
        price: 3200000,
        location: "Noale, Italy",
        images: ["https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=2070"],
        brand: "Aprilia",
        keySpecifications: { power: "217 HP", mileage: "305 km/h", cylinderCapacity: "1099 cc" },
        agent: { name: "Luca Botticelli", photo: "https://i.pravatar.cc/150?u=luca", company: "Italian Speed Shop", companyLogo: companyLogos.bike, joined: 30 }
    },
    {
        title: "Harley-Davidson CVO Road Glide",
        description: "The pinnacle of Harley-Davidson style and design. Each year, we create a limited collection of super-premium motorcycles.",
        price: 5500000,
        location: "Milwaukee, USA",
        images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=2070"],
        brand: "Harley-Davidson",
        keySpecifications: { power: "115 HP", mileage: "175 km/h", cylinderCapacity: "1923 cc" },
        agent: { name: "Billy Bob", photo: "https://i.pravatar.cc/150?u=billy", company: "American Iron", companyLogo: companyLogos.bike, joined: 84 }
    }
];

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb+srv://otulia_admin:6KWLJGoNGKwEubE6@otulia-cluster.m3pbjxj.mongodb.net/otulia?retryWrites=true&w=majority";
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB for re-seeding items");

        await YachtAsset.deleteMany({});
        await BikeAsset.deleteMany({});

        await YachtAsset.insertMany(yachtWithDefaults());
        await BikeAsset.insertMany(bikeWithDefaults());

        console.log("✅ Re-seeded yachts and bikes with more products and full agent info!");
        process.exit();
    } catch (err) {
        console.error("❌ Seed error", err);
        process.exit(1);
    }
};

function yachtWithDefaults() {
    return yachts.map(y => ({
        ...y,
        category: "Yacht",
        views: Math.floor(Math.random() * 1000) + 700,
        likes: Math.floor(Math.random() * 100) + 40,
        popularity: Math.floor(Math.random() * 10) + 1,
        specification: {
            yearOfConstruction: "2023",
            model: y.title,
            length: y.keySpecifications.mileage,
            condition: "New"
        },
        acquisition: 'buy',
    }))
}

function bikeWithDefaults() {
    return bikes.map(b => ({
        ...b,
        category: "Bike",
        views: Math.floor(Math.random() * 1000) + 600,
        likes: Math.floor(Math.random() * 100) + 30,
        popularity: Math.floor(Math.random() * 10) + 1,
        specification: {
            yearOfConstruction: "2024",
            model: b.title,
            power: b.keySpecifications.power,
            condition: "New"
        },
        acquisition: 'buy',
    }))
}

seedData();
