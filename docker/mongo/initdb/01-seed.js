// MongoDB seed script for Makesoft.io
// This script creates an admin user and sample forum threads
// Automatically executed by MongoDB on first initialization

use('makesoft');

// Create admin user
const adminUser = {
  username: 'admin',
  email: 'admin@makesoft.io',
  password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqK5Yz5K6C', // admin123
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Create sample users for forum threads
const sampleUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqK5Yz5K6C', // password123
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqK5Yz5K6C',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Insert users
print('Creating admin user...');
const adminResult = db.users.insertOne(adminUser);
const adminId = adminResult.insertedId;

print('Creating sample users...');
const insertedUsers = db.users.insertMany(sampleUsers);
const userIds = Object.values(insertedUsers.insertedIds);

// Create sample forum threads
const sampleThreads = [
  {
    title: 'Welcome to Makesoft Forum!',
    content: 'This is the first thread in our forum. Feel free to introduce yourself and start discussions!',
    authorId: adminId,
    authorUsername: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [],
    views: 0,
    likes: 0,
  },
  {
    title: 'Getting Started with Makesoft',
    content: 'New to Makesoft? Check out this guide to get started with our platform. We cover everything from account setup to advanced features.',
    authorId: userIds[0] || adminId,
    authorUsername: 'johndoe',
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [],
    views: 0,
    likes: 0,
  },
  {
    title: 'Best Practices for API Integration',
    content: 'Share your tips and tricks for integrating with the Makesoft API. What patterns have worked best for you?',
    authorId: userIds[1] || adminId,
    authorUsername: 'janedoe',
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [],
    views: 0,
    likes: 0,
  },
  {
    title: 'Feature Requests and Feedback',
    content: 'Have an idea for a new feature? Want to share feedback? This is the place to discuss what you\'d like to see in future updates.',
    authorId: adminId,
    authorUsername: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [],
    views: 0,
    likes: 0,
  },
  {
    title: 'Community Guidelines',
    content: 'Please read our community guidelines before posting. We aim to maintain a respectful and helpful environment for everyone.',
    authorId: adminId,
    authorUsername: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    replies: [],
    views: 0,
    likes: 0,
  },
];

print('Creating sample forum threads...');
db.threads.insertMany(sampleThreads);

print('Seed data created successfully!');
print('- Admin user: admin / admin123');
print('- Sample users: johndoe, janedoe / password123');
print('- 5 sample forum threads created');

