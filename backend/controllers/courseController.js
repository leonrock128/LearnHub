const Course = require('../models/Course');


// @route   GET /api/courses
const getAllCourses = async (req, res) => {
  try {
    const { search, category, level, isFree } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by level
    if (level) {
      filter.level = level;
    }
    
    // Filter by free/paid
    if (isFree !== undefined) {
      filter.price = isFree === 'true' ? 0 : { $gt: 0 };
    }
    
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch courses' 
    });
  }
};


// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch course' 
    });
  }
};


// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      category,
      duration,
      level,
      instructor
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title and description' 
      });
    }

    // Create course
    const course = new Course({
      title,
      description,
      price: price || 0,
      image: image || '',
      category: category || 'General',
      duration: duration || '',
      level: level || 'Beginner',
      instructor: instructor || 'Expert Instructor'
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create course' 
    });
  }
};


// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      category,
      duration,
      level,
      instructor
    } = req.body;

    // Find course
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Update course
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price !== undefined ? price : course.price;
    course.image = image || course.image;
    course.category = category || course.category;
    course.duration = duration || course.duration;
    course.level = level || course.level;
    course.instructor = instructor || course.instructor;

    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update course' 
    });
  }
};

// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete course' 
    });
  }
};


// @route   GET /api/courses/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('category');
    
    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch categories' 
    });
  }
};


const getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const freeCourses = await Course.countDocuments({ price: 0 });
    const paidCourses = await Course.countDocuments({ price: { $gt: 0 } });
    
    const categories = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const levels = await Course.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalCourses,
        free: freeCourses,
        paid: paidCourses,
        byCategory: categories,
        byLevel: levels
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics' 
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  getCourseStats
};