const Subscription = require('../models/Subscription');
const Course = require('../models/Course');


// @route   POST /api/subscribe
const subscribeToCourse = async (req, res) => {
  try {
    const { courseId, promoCode } = req.body;
    const userId = req.userId;

    // Validation
    if (!courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Course ID is required' 
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({ 
      userId, 
      courseId 
    });
    
    if (existingSubscription) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already subscribed to this course' 
      });
    }

    let pricePaid = course.price;
    let discountApplied = 0;
    let appliedPromoCode = null;

    // Handle free courses
    if (course.price === 0) {
      pricePaid = 0;
    } 
    // Handle paid courses
    else {
      // Promo code is required for paid courses
      if (!promoCode) {
        return res.status(400).json({ 
          success: false, 
          message: 'Promo code is required for paid courses' 
        });
      }

      // Validate promo code
      if (promoCode.toUpperCase() === process.env.PROMO_CODE) {
        const discountPercentage = parseInt(process.env.PROMO_DISCOUNT);
        discountApplied = (course.price * discountPercentage) / 100;
        pricePaid = course.price - discountApplied;
        appliedPromoCode = promoCode.toUpperCase();
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid promo code' 
        });
      }
    }

    // Create subscription
    const subscription = new Subscription({
      userId,
      courseId,
      pricePaid: Math.round(pricePaid * 100) / 100,
      originalPrice: course.price,
      discountApplied: Math.round(discountApplied * 100) / 100,
      promoCode: appliedPromoCode,
      subscribedAt: new Date()
    });

    await subscription.save();

    // Populate course details for response
    await subscription.populate('courseId');

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to course',
      subscription: {
        id: subscription._id,
        course: subscription.courseId,
        pricePaid: subscription.pricePaid,
        originalPrice: subscription.originalPrice,
        discountApplied: subscription.discountApplied,
        promoCode: subscription.promoCode,
        subscribedAt: subscription.subscribedAt
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already subscribed to this course' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe to course' 
    });
  }
};


// @route   GET /api/my-courses
const getMyCourses = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId })
      .populate('courseId')
      .sort({ subscribedAt: -1 });

    const courses = subscriptions.map(sub => ({
      subscriptionId: sub._id,
      course: sub.courseId,
      pricePaid: sub.pricePaid,
      originalPrice: sub.originalPrice,
      discountApplied: sub.discountApplied,
      promoCode: sub.promoCode,
      subscribedAt: sub.subscribedAt
    }));

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your courses' 
    });
  }
};


// @route   GET /api/subscriptions/:id
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate('courseId')
      .populate('userId', 'name email');

    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Subscription not found' 
      });
    }

    // Check if the subscription belongs to the requesting user
    if (subscription.userId._id.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this subscription' 
      });
    }

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Subscription not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch subscription' 
    });
  }
};


// @route   DELETE /api/subscriptions/:id
const unsubscribeFromCourse = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Subscription not found' 
      });
    }

    // Check if the subscription belongs to the requesting user
    if (subscription.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this subscription' 
      });
    }

    await subscription.deleteOne();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from course'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Subscription not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe from course' 
    });
  }
};


// @route   GET /api/subscriptions/stats
const getSubscriptionStats = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.userId });

    const totalCourses = subscriptions.length;
    const totalInvested = subscriptions.reduce((sum, sub) => sum + sub.pricePaid, 0);
    const totalSaved = subscriptions.reduce((sum, sub) => sum + sub.discountApplied, 0);
    const freeCourses = subscriptions.filter(sub => sub.pricePaid === 0).length;
    const paidCourses = subscriptions.filter(sub => sub.pricePaid > 0).length;

    res.json({
      success: true,
      stats: {
        totalCourses,
        totalInvested: Math.round(totalInvested * 100) / 100,
        totalSaved: Math.round(totalSaved * 100) / 100,
        freeCourses,
        paidCourses
      }
    });
  } catch (error) {
    console.error('Get subscription stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch subscription statistics' 
    });
  }
};


// @route   GET /api/subscriptions/check/:courseId
const checkSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.userId,
      courseId: req.params.courseId
    });

    res.json({
      success: true,
      isSubscribed: !!subscription,
      subscription: subscription || null
    });
  } catch (error) {
    console.error('Check subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check subscription status' 
    });
  }
};


// @route   POST /api/subscriptions/validate-promo
const validatePromoCode = async (req, res) => {
  try {
    const { promoCode, courseId } = req.body;

    if (!promoCode || !courseId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Promo code and course ID are required' 
      });
    }

    // Get course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if promo code is valid
    if (promoCode.toUpperCase() === process.env.PROMO_CODE) {
      const discountPercentage = parseInt(process.env.PROMO_DISCOUNT);
      const discountAmount = (course.price * discountPercentage) / 100;
      const finalPrice = course.price - discountAmount;

      return res.json({
        success: true,
        valid: true,
        message: 'Promo code is valid',
        discount: {
          code: promoCode.toUpperCase(),
          percentage: discountPercentage,
          amount: Math.round(discountAmount * 100) / 100,
          originalPrice: course.price,
          finalPrice: Math.round(finalPrice * 100) / 100
        }
      });
    }

    res.status(400).json({
      success: false,
      valid: false,
      message: 'Invalid promo code'
    });
  } catch (error) {
    console.error('Validate promo error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to validate promo code' 
    });
  }
};

module.exports = {
  subscribeToCourse,
  getMyCourses,
  getSubscriptionById,
  unsubscribeFromCourse,
  getSubscriptionStats,
  checkSubscription,
  validatePromoCode
};