import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './model/listing.model.js';

dotenv.config();

const listings = [
  {
    name: 'Cozy Apartment in the City Center',
    description: 'A cozy apartment located in the heart of the city, perfect for a small family or a couple.',
    address: '123 Main St, Cityville, USA',
    regularPrice: 1500,
    discountPrice: 1400,
    bedRooms: 2,
    furnished: true,
    parking: true,
    type: 'rent',
    offer: true,
    imageUrls: ['https://via.placeholder.com/150'],
    washrooms: 2,
    userRef: 'user1',
    location: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484],
    },
    reviews: [
      {
        comment: 'Great location, but a bit noisy.',
        rating: 4,
      },
      {
        comment: 'Loved the apartment, very clean and well-maintained.',
        rating: 5,
      },
    ],
  },
  {
    name: 'Spacious House with a Garden',
    description: 'A spacious house with a beautiful garden, ideal for a large family.',
    address: '456 Oak Ave, Suburbia, USA',
    regularPrice: 2500,
    discountPrice: 2400,
    bedRooms: 4,
    furnished: false,
    parking: true,
    type: 'rent',
    offer: true,
    imageUrls: ['https://via.placeholder.com/150'],
    washrooms: 3,
    userRef: 'user2',
    location: {
      type: 'Point',
      coordinates: [-73.9867, 40.7494],
    },
    reviews: [
      {
        comment: 'The garden is amazing!',
        rating: 5,
      },
      {
        comment: 'The house is a bit old, but spacious.',
        rating: 3,
      },
    ],
  },
  {
    name: 'Modern Loft in a Trendy Neighborhood',
    description: 'A modern loft with a stylish design, located in a trendy neighborhood with lots of cafes and restaurants.',
    address: '789 Pine St, Hipsterville, USA',
    regularPrice: 2000,
    discountPrice: 1900,
    bedRooms: 1,
    furnished: true,
    parking: false,
    type: 'rent',
    offer: true,
    imageUrls: ['https://via.placeholder.com/150'],
    washrooms: 1,
    userRef: 'user3',
    location: {
      type: 'Point',
      coordinates: [-73.9847, 40.7474],
    },
    reviews: [
      {
        comment: 'Love the neighborhood, so many things to do!',
        rating: 5,
      },
      {
        comment: 'The loft is a bit small for the price.',
        rating: 4,
      },
    ],
  },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO);
  await Listing.deleteMany({});
  await Listing.insertMany(listings);
  console.log('Database seeded!');
  mongoose.connection.close();
};

seedDB();