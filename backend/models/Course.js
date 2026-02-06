const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description'],
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=800&h=400&fit=crop',
  },
  category: {
    type: String,
    default: 'General',
  },
  duration: {
    type: String,
    default: '4 weeks',
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual to check if course is free
courseSchema.virtual('isFree').get(function () {
  return this.price === 0;
});

// Ensure virtuals are included in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);