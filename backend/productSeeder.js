const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust path as needed
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/grocery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected...');
}).catch((err) => {
  console.error(err);
});

const sampleProducts = [
  {
    name: 'Tomato',
    price: 20,
    image: 'https://images.unsplash.com/photo-1582281298052-753c516cdae6?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Potato',
    price: 15,
    image: 'https://images.unsplash.com/photo-1582515073490-dbe3c3a1ba4e?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Carrot',
    price: 25,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Onion',
    price: 18,
    image: 'https://images.unsplash.com/photo-1615484477640-708ccf0853c1?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Cabbage',
    price: 22,
    image: 'https://images.unsplash.com/photo-1606925797301-df72cd0bfa2e?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Broccoli',
    price: 30,
    image: 'https://images.unsplash.com/photo-1604908812490-93a755b4f4d3?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Spinach',
    price: 10,
    image: 'https://images.unsplash.com/photo-1600774237230-0b1c1c6b8353?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Capsicum',
    price: 28,
    image: 'https://images.unsplash.com/photo-1582510564143-2c1b3c2dcfa1?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Cauliflower',
    price: 26,
    image: 'https://images.unsplash.com/photo-1622622012825-52b2f6dbdbbd?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Green Peas',
    price: 35,
    image: 'https://images.unsplash.com/photo-1562607032-0f0b2a3c301b?auto=format&fit=crop&w=150&q=80',
  },
];

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    console.log('Existing products removed.');

    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted.');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding products:', error);
    mongoose.connection.close();
  }
};

seedProducts();
