const express = require('express');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  getCourseStats
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/categories', getCategories);
router.get('/stats', getCourseStats);
router.get('/:id', getCourseById);

router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;