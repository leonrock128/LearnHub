const express = require('express');
const {
  subscribeToCourse,
  getMyCourses,
  getSubscriptionById,
  unsubscribeFromCourse,
  getSubscriptionStats,
  checkSubscription,
  validatePromoCode
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/subscribe', protect, subscribeToCourse);
router.get('/my-courses', protect, getMyCourses);
router.get('/subscriptions/stats', protect, getSubscriptionStats);
router.get('/subscriptions/check/:courseId', protect, checkSubscription);
router.post('/subscriptions/validate-promo', protect, validatePromoCode);
router.get('/subscriptions/:id', protect, getSubscriptionById);
router.delete('/subscriptions/:id', protect, unsubscribeFromCourse);

module.exports = router;