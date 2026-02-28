require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./models/Review');
const crypto = require('crypto');

const names = [
    "Rahul K", "Priya Sharma", "Sneha Reddy", "Vikram Singh", "Ananya G", "Ramesh Babu", "Kavya M", "Srinivas Gowda",
    "Lakshmi N", "Arun Kumar", "Deepa C", "Karthik R", "Nandini P", "Sachin T", "Meghana S", "Praveen H", "Shweta B",
    "Darshan V", "Pooja K", "Vijay M", "Shruti D", "Chetan R", "Neha S", "Manoj P", "Anjali V", "Ganesh K", "Sindhu M",
    "Vinay S", "Aishwarya R", "Mohan D", "Swati N", "Avinash P", "Ranjitha K", "Kiran V", "Bhagya S", "Naveen M", "Keerthi R",
    "Surya P", "Pallavi K", "Harish N", "Sushma V", "Pradeep S", "Asha M", "Ravi C", "Divya R", "Manjunath K", "Roopa S",
    "Santosh V", "Veena P", "Pramod M", "Mamatha K", "Girish S", "Shilpa V", "Ashok R", "Sujatha N", "Raghu P", "Chaitra S",
    "Anand K", "Kavitha V", "Sunil M", "Netra R", "Prashanth S", "Geetha P", "Yogesh K", "Bhavika V", "Mahesh N", "Sangeetha S",
    "Nitin R", "Jyothi P", "Rakesh M", "Archana K", "Deepak V", "Hemalatha S", "Varun R", "Vidya N", "Harsha P", "Anita K",
    "Sudeep M", "Pallavi S", "Rajesh V", "Rekha P", "Niranjan K", "Suma M", "Tejas R", "Vanitha S", "Lokesh P", "Gowri V",
    "Aditya K", "Bhavana M", "Puneeth S", "Rashmi R", "Shashi P"
];

const templates = [
    "Absolutely loved the hair spa! The staff is very polite and the ambience is premium. Best salon in Ballari.",
    "Got a fade cut and beard trim. The stylist knew exactly what I wanted. Very professional.",
    "Great facial services. My skin feels amazing. The waiting time was a bit long but worth it.",
    "Highly recommend Slooks for their premium products and hygienic environment.",
    "Bridal makeup was flawless. Everyone complimented my look. Thank you Team Slooks!",
    "One of the best unisex salons in town. Very clean and the staff is well trained.",
    "Loved the ambiance! The gold facial was extremely relaxing and gave me an instant glow.",
    "They use top notch products. Got a keratin treatment and my hair has never felt softer.",
    "Exceptional service. The staff took the time to understand exactly how I wanted my haircut.",
    "Very reasonable prices for the premium quality they offer. Will definitely visit again.",
    "The pedicures here are amazing. Very relaxing and they take their time. Highly recommended.",
    "Friendly staff and great music. Made my mundane haircut a fun experience.",
    "Got my wedding makeup done here. They made me look stunning! Forever grateful.",
    "Best place in Ballari for hair color. They got the exact shade of balayage I was looking for.",
    "Very professional team. They follow all hygiene protocols which made me feel very safe.",
    "I'm a regular here. Consistent quality every single time I visit for my grooming.",
    "The hair botox treatment did wonders for my frizzy hair. Worth every penny.",
    "Excellent value for money. The stylists really know what they are doing.",
    "Beautiful salon with a great vibe. The staff is very attentive and skilled.",
    "Quick and efficient service. I walked in without an appointment and they accommodated me effortlessly."
];

function generateReviews(count) {
    const reviews = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const name = names[i % names.length];
        const rating = Math.random() > 0.8 ? 3 : (Math.random() > 0.3 ? 5 : 4);
        const text = templates[i % templates.length];

        const pastDate = new Date(now.getTime() - Math.random() * 63072000000);

        reviews.push({
            reviewerName: name,
            rating: rating,
            reviewText: text,
            reviewDate: pastDate.toISOString(),
            profilePhotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        });
    }
    return reviews;
}

async function runSeed() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('Skipping reviews seed: No MONGODB_URI found.');
            return;
        }

        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to MongoDB Atlas for Review Seeding');
        }

        const dbReviews = generateReviews(90);

        // Delete existing reviews
        await Review.deleteMany({});
        console.log("Cleared existing reviews.");

        // Insert new reviews
        const inserted = await Review.insertMany(dbReviews);
        console.log(`Successfully seeded ${inserted.length} Google reviews into the database.`);

        process.exit(0);
    } catch (err) {
        console.error('Failed to seed reviews:', err);
        process.exit(1);
    }
}

runSeed();
