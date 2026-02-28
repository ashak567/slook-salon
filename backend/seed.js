require('dotenv').config();
const bcrypt = require('bcryptjs');

const services = [
    // WOMEN - Hair Services
    { name: 'Haircut Basic', cat: 'Women', sub: 'Hair Services', desc: 'Basic hair trim and cut', pMin: 600, pMax: 600, dur: 45 },
    { name: 'Haircut Advanced', cat: 'Women', sub: 'Hair Services', desc: 'Advanced styling cut', pMin: 800, pMax: 800, dur: 60 },
    { name: 'Blow Dry', cat: 'Women', sub: 'Hair Services', desc: 'Classic blow dry', pMin: 500, pMax: 500, dur: 30 },
    { name: 'Ironing', cat: 'Women', sub: 'Hair Services', desc: 'Hair ironing/straightening', pMin: 600, pMax: 600, dur: 40 },
    { name: 'Curling', cat: 'Women', sub: 'Hair Services', desc: 'Hair curling', pMin: 800, pMax: 800, dur: 45 },
    { name: 'Occasion Hairstyling', cat: 'Women', sub: 'Hair Services', desc: 'Special occasion styling', pMin: 1500, pMax: 1500, dur: 90 },
    { name: 'Global Hair Color', cat: 'Women', sub: 'Hair Services', desc: 'Full hair coloring', pMin: 2500, pMax: 4500, dur: 180 },
    { name: 'Root Touch-up', cat: 'Women', sub: 'Hair Services', desc: 'Root touch up coloring', pMin: 1500, pMax: 1500, dur: 90 },
    { name: 'Highlights', cat: 'Women', sub: 'Hair Services', desc: 'Hair highlights', pMin: 3000, pMax: 5000, dur: 180 },
    { name: 'Balayage', cat: 'Women', sub: 'Hair Services', desc: 'Balayage hair coloring', pMin: 5000, pMax: 8000, dur: 180 },
    { name: 'Ombre', cat: 'Women', sub: 'Hair Services', desc: 'Ombre hair coloring', pMin: 4500, pMax: 7000, dur: 180 },
    { name: 'Hair Spa', cat: 'Women', sub: 'Hair Services', desc: 'Relaxing hair spa', pMin: 1200, pMax: 1200, dur: 45 },
    { name: 'Keratin', cat: 'Women', sub: 'Hair Services', desc: 'Keratin treatment', pMin: 4000, pMax: 7000, dur: 180 },
    { name: 'Smoothening', cat: 'Women', sub: 'Hair Services', desc: 'Hair smoothening', pMin: 3500, pMax: 6000, dur: 180 },
    { name: 'Rebonding', cat: 'Women', sub: 'Hair Services', desc: 'Hair rebonding', pMin: 5000, pMax: 8000, dur: 180 },
    { name: 'Hair Botox', cat: 'Women', sub: 'Hair Services', desc: 'Hair botox treatment', pMin: 4500, pMax: 7000, dur: 120 },
    { name: 'Protein Treatment', cat: 'Women', sub: 'Hair Services', desc: 'Hair protein treatment', pMin: 2000, pMax: 2000, dur: 60 },
    { name: 'Anti-Dandruff Treatment', cat: 'Women', sub: 'Hair Services', desc: 'Anti-dandruff scalp treatment', pMin: 1500, pMax: 1500, dur: 45 },
    { name: 'Hair Fall Treatment', cat: 'Women', sub: 'Hair Services', desc: 'Hair fall control treatment', pMin: 1800, pMax: 1800, dur: 60 },
    { name: 'Scalp Treatment', cat: 'Women', sub: 'Hair Services', desc: 'Nourishing scalp treatment', pMin: 1500, pMax: 1500, dur: 45 },
    { name: 'Hair Mask', cat: 'Women', sub: 'Hair Services', desc: 'Hair restoring mask', pMin: 1000, pMax: 1000, dur: 30 },
    { name: 'Nanoplastia', cat: 'Women', sub: 'Hair Services', desc: 'Nanoplastia hair therapy', pMin: 7000, pMax: 10000, dur: 180 },
    { name: 'Olaplex Bond Repair', cat: 'Women', sub: 'Hair Services', desc: 'Olaplex strengthening', pMin: 2500, pMax: 2500, dur: 60 },

    // WOMEN - Skin & Face
    { name: 'Clean-up', cat: 'Women', sub: 'Skin & Face', desc: 'Basic face clean-up', pMin: 700, pMax: 700, dur: 30 },
    { name: 'Basic Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Classic relaxing facial', pMin: 1200, pMax: 1200, dur: 60 },
    { name: 'Fruit Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Fruit-based facial', pMin: 1500, pMax: 1500, dur: 60 },
    { name: 'Gold Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Premium gold facial', pMin: 2000, pMax: 2000, dur: 75 },
    { name: 'Diamond Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Luxury diamond facial', pMin: 2500, pMax: 2500, dur: 75 },
    { name: 'Oxy Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Oxygenating facial', pMin: 2200, pMax: 2200, dur: 75 },
    { name: 'Anti-Aging Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Anti-aging skin treatment', pMin: 2500, pMax: 2500, dur: 75 },
    { name: 'Acne Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Acne clearing facial', pMin: 2000, pMax: 2000, dur: 60 },
    { name: 'D-Tan', cat: 'Women', sub: 'Skin & Face', desc: 'De-tanning treatment', pMin: 800, pMax: 800, dur: 30 },
    { name: 'Face Bleach', cat: 'Women', sub: 'Skin & Face', desc: 'Face bleaching', pMin: 500, pMax: 500, dur: 20 },
    { name: 'Hydrating Mask', cat: 'Women', sub: 'Skin & Face', desc: 'Intense hydration mask', pMin: 600, pMax: 600, dur: 30 },
    { name: 'Charcoal Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Deep cleanse charcoal facial', pMin: 1800, pMax: 1800, dur: 60 },
    { name: 'LED Therapy', cat: 'Women', sub: 'Skin & Face', desc: 'LED light skin therapy', pMin: 3000, pMax: 3000, dur: 60 },
    { name: 'Hydra Facial', cat: 'Women', sub: 'Skin & Face', desc: 'Advanced hydra facial', pMin: 4000, pMax: 4000, dur: 60 },
    { name: 'Microdermabrasion', cat: 'Women', sub: 'Skin & Face', desc: 'Skin resurfacing', pMin: 3500, pMax: 3500, dur: 60 },
    { name: 'Chemical Peel', cat: 'Women', sub: 'Skin & Face', desc: 'Chemical peel treatment', pMin: 3000, pMax: 3000, dur: 45 },

    // WOMEN - Waxing & Hair Removal
    { name: 'Eyebrow', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Eyebrow shaping', pMin: 50, pMax: 50, dur: 10 },
    { name: 'Upper Lip', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Upper lip hair removal', pMin: 30, pMax: 30, dur: 10 },
    { name: 'Full Face', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Full face threading/waxing', pMin: 200, pMax: 200, dur: 20 },
    { name: 'Underarm', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Underarm waxing', pMin: 300, pMax: 300, dur: 15 },
    { name: 'Half Hand', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Half hand waxing', pMin: 400, pMax: 400, dur: 20 },
    { name: 'Full Hand', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Full hand waxing', pMin: 700, pMax: 700, dur: 30 },
    { name: 'Half Leg', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Half leg waxing', pMin: 600, pMax: 600, dur: 25 },
    { name: 'Full Leg', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Full leg waxing', pMin: 1000, pMax: 1000, dur: 40 },
    { name: 'Full Body', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Full body waxing', pMin: 2500, pMax: 2500, dur: 90 },
    { name: 'Bikini', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Bikini line waxing', pMin: 1500, pMax: 1500, dur: 30 },
    { name: 'Brazilian', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Brazilian waxing', pMin: 2000, pMax: 2000, dur: 45 },
    { name: 'Rica Wax (Full Leg)', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Premium Rica wax full leg', pMin: 1200, pMax: 1200, dur: 45 },
    { name: 'Chocolate Wax', cat: 'Women', sub: 'Waxing & Hair Removal', desc: 'Chocolate waxing', pMin: 1300, pMax: 1300, dur: 45 },

    // WOMEN - Nail Services
    { name: 'Basic Manicure', cat: 'Women', sub: 'Nail Services', desc: 'Classic manicure', pMin: 600, pMax: 600, dur: 30 },
    { name: 'Spa Manicure', cat: 'Women', sub: 'Nail Services', desc: 'Relaxing spa manicure', pMin: 1000, pMax: 1000, dur: 45 },
    { name: 'Basic Pedicure', cat: 'Women', sub: 'Nail Services', desc: 'Classic pedicure', pMin: 800, pMax: 800, dur: 40 },
    { name: 'Spa Pedicure', cat: 'Women', sub: 'Nail Services', desc: 'Relaxing spa pedicure', pMin: 1500, pMax: 1500, dur: 60 },
    { name: 'Gel Polish', cat: 'Women', sub: 'Nail Services', desc: 'Long-lasting gel polish', pMin: 700, pMax: 700, dur: 30 },
    { name: 'Acrylic Nails', cat: 'Women', sub: 'Nail Services', desc: 'Acrylic nail extensions', pMin: 2500, pMax: 2500, dur: 90 },
    { name: 'Nail Extensions', cat: 'Women', sub: 'Nail Services', desc: 'Standard nail extensions', pMin: 3000, pMax: 3000, dur: 90 },
    { name: 'Nail Art', cat: 'Women', sub: 'Nail Services', desc: 'Custom nail art designs', pMin: 500, pMax: 1500, dur: 45 },
    { name: 'French Manicure', cat: 'Women', sub: 'Nail Services', desc: 'Classic French manicure', pMin: 1200, pMax: 1200, dur: 45 },
    { name: 'Paraffin Therapy', cat: 'Women', sub: 'Nail Services', desc: 'Smoothing paraffin treatment', pMin: 800, pMax: 800, dur: 30 },

    // WOMEN - Bridal & Makeup
    { name: 'Bridal Makeup', cat: 'Women', sub: 'Bridal & Makeup', desc: 'Complete bridal makeup package', pMin: 10000, pMax: 20000, dur: 180 },
    { name: 'HD Makeup', cat: 'Women', sub: 'Bridal & Makeup', desc: 'High Definition makeup', pMin: 7000, pMax: 7000, dur: 90 },
    { name: 'Airbrush', cat: 'Women', sub: 'Bridal & Makeup', desc: 'Flawless airbrush makeup', pMin: 9000, pMax: 9000, dur: 90 },
    { name: 'Party Makeup', cat: 'Women', sub: 'Bridal & Makeup', desc: 'Elegant party makeup', pMin: 2500, pMax: 2500, dur: 60 },
    { name: 'Reception Makeup', cat: 'Women', sub: 'Bridal & Makeup', desc: 'Special reception look', pMin: 6000, pMax: 6000, dur: 90 },
    { name: 'Engagement Makeup', cat: 'Women', sub: 'Bridal & Makeup', desc: 'Engagement day makeup', pMin: 5000, pMax: 5000, dur: 90 },
    { name: 'Saree Draping', cat: 'Women', sub: 'Bridal & Makeup', desc: 'Professional saree draping', pMin: 800, pMax: 800, dur: 30 },
    { name: 'Pre-Bridal Package', cat: 'Women', sub: 'Bridal & Makeup', desc: 'Complete pre-bridal prep', pMin: 15000, pMax: 25000, dur: 300 },

    // MEN - Hair
    { name: 'Regular Haircut', cat: 'Men', sub: 'Hair Services', desc: 'Classic men\'s haircut', pMin: 300, pMax: 300, dur: 30 },
    { name: 'Fade Cut', cat: 'Men', sub: 'Hair Services', desc: 'Modern fade haircut', pMin: 400, pMax: 400, dur: 40 },
    { name: 'Styling Cut', cat: 'Men', sub: 'Hair Services', desc: 'Advanced styled haircut', pMin: 450, pMax: 450, dur: 45 },
    { name: 'Hair Wash', cat: 'Men', sub: 'Hair Services', desc: 'Refreshing hair wash', pMin: 200, pMax: 200, dur: 15 },
    { name: 'Hair Spa', cat: 'Men', sub: 'Hair Services', desc: 'Relaxing hair spa', pMin: 800, pMax: 800, dur: 45 },
    { name: 'Anti-Dandruff', cat: 'Men', sub: 'Hair Services', desc: 'Anti-dandruff treatment', pMin: 1000, pMax: 1000, dur: 45 },
    { name: 'Hair Fall Treatment', cat: 'Men', sub: 'Hair Services', desc: 'Hair fall treatment', pMin: 1200, pMax: 1200, dur: 45 },
    { name: 'Keratin', cat: 'Men', sub: 'Hair Services', desc: 'Keratin smoothing', pMin: 2500, pMax: 2500, dur: 120 },
    { name: 'Hair Color', cat: 'Men', sub: 'Hair Services', desc: 'Full hair color/dye', pMin: 1500, pMax: 1500, dur: 60 },
    { name: 'Scalp Treatment', cat: 'Men', sub: 'Hair Services', desc: 'Deep scalp cleanse', pMin: 1000, pMax: 1000, dur: 45 },

    // MEN - Beard & Shave
    { name: 'Beard Trim', cat: 'Men', sub: 'Beard & Shave', desc: 'Basic beard trim', pMin: 150, pMax: 150, dur: 15 },
    { name: 'Beard Styling', cat: 'Men', sub: 'Beard & Shave', desc: 'Precision beard styling', pMin: 200, pMax: 200, dur: 20 },
    { name: 'Beard Design', cat: 'Men', sub: 'Beard & Shave', desc: 'Custom beard design', pMin: 250, pMax: 250, dur: 30 },
    { name: 'Clean Shave', cat: 'Men', sub: 'Beard & Shave', desc: 'Classic clean shave', pMin: 150, pMax: 150, dur: 15 },
    { name: 'Hot Towel Shave', cat: 'Men', sub: 'Beard & Shave', desc: 'Premium hot towel shave', pMin: 250, pMax: 250, dur: 25 },
    { name: 'Beard Spa', cat: 'Men', sub: 'Beard & Shave', desc: 'Softening beard spa', pMin: 700, pMax: 700, dur: 30 },
    { name: 'Head Shave', cat: 'Men', sub: 'Beard & Shave', desc: 'Complete head shave', pMin: 300, pMax: 300, dur: 20 },

    // MEN - Skin & Face
    { name: 'Clean-up', cat: 'Men', sub: 'Skin & Face', desc: 'Basic face clean-up', pMin: 500, pMax: 500, dur: 30 },
    { name: 'Basic Facial', cat: 'Men', sub: 'Skin & Face', desc: 'Classic men\'s facial', pMin: 1000, pMax: 1000, dur: 45 },
    { name: 'Anti-Tan', cat: 'Men', sub: 'Skin & Face', desc: 'De-tanning treatment', pMin: 1200, pMax: 1200, dur: 45 },
    { name: 'Charcoal Facial', cat: 'Men', sub: 'Skin & Face', desc: 'Deep pore charcoal facial', pMin: 1500, pMax: 1500, dur: 60 },
    { name: 'Oil Control', cat: 'Men', sub: 'Skin & Face', desc: 'Oil balancing facial', pMin: 1200, pMax: 1200, dur: 45 },
    { name: 'Acne Control', cat: 'Men', sub: 'Skin & Face', desc: 'Acne control treatment', pMin: 1500, pMax: 1500, dur: 60 },
    { name: 'D-Tan', cat: 'Men', sub: 'Skin & Face', desc: 'Quick de-tan', pMin: 600, pMax: 600, dur: 30 },

    // MEN - Massage
    { name: 'Head Massage', cat: 'Men', sub: 'Massage', desc: 'Relaxing head massage', pMin: 300, pMax: 300, dur: 20 },
    { name: 'Shoulder Massage', cat: 'Men', sub: 'Massage', desc: 'Stress relief shoulder massage', pMin: 400, pMax: 400, dur: 30 },
    { name: 'Foot Massage', cat: 'Men', sub: 'Massage', desc: 'Soothing foot massage', pMin: 500, pMax: 500, dur: 30 },
    { name: 'Full Body Massage', cat: 'Men', sub: 'Massage', desc: 'Deep tissue full body massage', pMin: 2000, pMax: 2000, dur: 60 },

    // UNISEX PREMIUM ADD-ONS
    { name: 'Body Polishing', cat: 'Unisex', sub: 'Premium Add-ons', desc: 'Full body glowing polish', pMin: 3000, pMax: 3000, dur: 90 },
    { name: 'Body Scrub', cat: 'Unisex', sub: 'Premium Add-ons', desc: 'Exfoliating body scrub', pMin: 2000, pMax: 2000, dur: 60 },
    { name: 'Body Wrap', cat: 'Unisex', sub: 'Premium Add-ons', desc: 'Detoxifying body wrap', pMin: 2500, pMax: 2500, dur: 60 },
    { name: 'Laser Hair Removal', cat: 'Unisex', sub: 'Premium Add-ons', desc: 'Per session laser hair reduction', pMin: 2500, pMax: 5000, dur: 60 },
];

const mongoose = require('mongoose');
const Service = require('./models/Service');
const Staff = require('./models/Staff');

async function seed() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('Skipping seed: No MONGODB_URI found.');
            return;
        }

        // We assume server.js establishes connections in real app, but seed.js might run standalone
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(MONGODB_URI);
        }

        // Seed Services
        const serviceCount = await Service.countDocuments();
        if (serviceCount === 0) {
            const formattedServices = services.map(s => ({
                serviceName: s.name,
                category: s.cat,
                subCategory: s.sub,
                description: s.desc,
                priceMin: s.pMin,
                priceMax: s.pMax,
                duration: s.dur
            }));
            await Service.insertMany(formattedServices);
            console.log('Seeded services collection.');
        } else {
            console.log('Services collection already seeded.');
        }

        // Seed default admin user (Owner)
        const staffCount = await Staff.countDocuments();
        if (staffCount === 0) {
            const hash = bcrypt.hashSync('slooks123!', 10);
            await Staff.create({ username: 'owner', password: hash, role: 'admin' });
            console.log('Seeded default owner info (owner / slooks123!)');
        }

    } catch (err) {
        console.error('Error during seeding:', err);
    }
}

// Run seed right after initialization
setTimeout(seed, 1000);
