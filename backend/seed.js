const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();

// Mock course data
const courses = [
  {
    title: 'Full Stack Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a full-stack developer. This comprehensive course covers everything from frontend to backend development.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    category: 'Web Development',
    duration: '12 weeks',
    level: 'Beginner',
  },
  {
    title: 'React Mastery Course',
    description: 'Master React.js from basics to advanced concepts. Learn hooks, context API, Redux, and build scalable applications. Includes real-world projects and best practices.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    category: 'Frontend Development',
    duration: '8 weeks',
    level: 'Intermediate',
  },
  {
    title: 'Introduction to Programming',
    description: 'Start your coding journey! Learn programming fundamentals, problem-solving, and basic algorithms. Perfect for complete beginners who want to learn to code.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop',
    category: 'Programming Basics',
    duration: '6 weeks',
    level: 'Beginner',
  },
  {
    title: 'Advanced Node.js Development',
    description: 'Deep dive into Node.js, Express, REST APIs, authentication, security, testing, and deployment. Build production-ready backend applications.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    category: 'Backend Development',
    duration: '10 weeks',
    level: 'Advanced',
  },
  {
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design. Master Figma, create wireframes, prototypes, and design beautiful interfaces.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    category: 'Design',
    duration: '6 weeks',
    level: 'Beginner',
  },
  {
    title: 'MongoDB Database Design',
    description: 'Master MongoDB database design, queries, indexing, aggregation, and performance optimization. Learn to build scalable NoSQL databases.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
    category: 'Database',
    duration: '7 weeks',
    level: 'Intermediate',
  },
  {
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis, visualization, and machine learning. Work with pandas, NumPy, matplotlib, and scikit-learn.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop',
    category: 'Data Science',
    duration: '10 weeks',
    level: 'Intermediate',
  },
];

// Dummy users
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();

    console.log('📝 Cleared existing data');

    // Insert users
    const createdUsers = await User.create(users);
    console.log(` ${createdUsers.length} users created`);

    // Insert courses
    const createdCourses = await Course.create(courses);
    console.log(` ${createdCourses.length} courses created`);

    console.log('\n Database seeded successfully!');
    console.log('\n Dummy User Credentials:');
    console.log('───────────────────────────────');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log('───────────────────────────────');
    });

    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();