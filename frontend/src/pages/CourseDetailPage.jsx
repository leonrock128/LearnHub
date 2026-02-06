import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, subscriptionAPI } from '../services/api';
import { 
  Clock, BarChart, User, ArrowLeft, CheckCircle, 
  Tag, DollarSign, Sparkles, Lock, Unlock 
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      setCourse(response.data.course);
      setDiscountedPrice(response.data.course.price);
    } catch (error) {
      toast.error('Failed to load course details');
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    if (promoCode.toUpperCase() === 'BFSALE25') {
      const discount = course.price * 0.5;
      setDiscountedPrice(course.price - discount);
      setPromoApplied(true);
      toast.success('Promo code applied! 50% discount activated!', {
        duration: 4000,
        icon: '🎊',
      });
    } else {
      toast.error('Invalid promo code');
      setPromoApplied(false);
      setDiscountedPrice(course.price);
    }
  };

  const handleSubscribe = async () => {
    // For paid courses, ensure promo is applied
    if (course.price > 0 && !promoApplied) {
      toast.error('Please apply a valid promo code for paid courses');
      return;
    }

    setSubscribing(true);
    try {
      const subscriptionData = {
        courseId: course._id,
      };

      // Add promo code if it's a paid course and promo is applied
      if (course.price > 0 && promoApplied) {
        subscriptionData.promoCode = promoCode.toUpperCase();
      }
      console.log('Subscribing with data:', subscriptionData);

      const response = await subscriptionAPI.subscribe(subscriptionData);
      
      toast.success('Successfully subscribed to course!', {
        duration: 4000,
      });

      // Navigate to My Courses after a short delay
      setTimeout(() => {
        navigate('/my-courses');
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to subscribe';
      toast.error(message);
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="skeleton h-96 w-full rounded-2xl mb-8"></div>
            <div className="skeleton h-8 w-3/4 mb-4"></div>
            <div className="skeleton h-6 w-full mb-3"></div>
            <div className="skeleton h-6 w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <button onClick={() => navigate('/home')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isFree = course.price === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Courses</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Image */}
            <div className="card overflow-hidden mb-8 animate-fade-in">
              <div className="relative h-80 bg-gradient-to-br from-primary-400 to-primary-600">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                    {course.title.charAt(0)}
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <span className="badge bg-white/90 text-gray-800 shadow-lg text-sm badge-free">
                    {course.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="card p-8 animate-slide-up">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  <span className="font-medium">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-primary-600" />
                  <span>{course.level}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Course</h2>
                <p className="text-gray-600 leading-relaxed">{course.description}</p>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 animate-slide-up animation-delay-200">
              {/* Price Display */}
              <div className="mb-6">
                {isFree ? (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-xl font-bold text-lg">
                      <Unlock className="w-5 h-5 mr-2" />
                      FREE COURSE
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-4">
                      {promoApplied ? (
                        <div>
                          <p className="text-sm text-gray-500 line-through mb-1">
                            ${course.price.toFixed(2)}
                          </p>
                          <p className="text-4xl font-bold gradient-text">
                            ${discountedPrice.toFixed(2)}
                          </p>
                          <p className="text-sm text-green-600 font-semibold mt-1">
                            50% OFF Applied!
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-4xl font-bold text-gray-900">
                            ${course.price.toFixed(2)}
                          </p>
                          <div className="flex items-center justify-center mt-2 text-amber-600">
                            <Lock className="w-4 h-4 mr-1" />
                            <p className="text-sm font-semibold">Promo code required</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Promo Code Section */}
                    <div className="bg-gradient-to-r from-accent-50 to-primary-50 p-4 rounded-xl border-2 border-accent-200 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-5 h-5 text-accent-600" />
                        <p className="text-sm font-bold text-gray-900">
                          Black Friday Special
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="w-full sm:flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-sm font-mono"
                          disabled={promoApplied}
                        />
                        <button
                          onClick={handleApplyPromo}
                          disabled={promoApplied}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                            promoApplied
                              ? 'bg-green-500 text-white cursor-not-allowed text-2xl'
                              : 'bg-primary hover:bg-primary-700 text-gray-900 badge-free'
                          }`}
                        >
                          {promoApplied ? '✓' : 'Apply'}
                        </button>
                      </div>
                      
                      {!promoApplied && (
                        <p className="text-xs text-gray-600">
                          Use code <code className="bg-white px-2 py-0.5 rounded font-mono text-accent-600 font-bold">BFSALE25</code> for 50% off
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                disabled={subscribing || (course.price > 0 && !promoApplied)}
                className={`w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFree ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : ''
                }`}
              >
                {subscribing ? (
                  <>
                    <div className="spinner border-white"></div>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{isFree ? 'Enroll for Free' : 'Subscribe Now'}</span>
                  </>
                )}
              </button>

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  What's included:
                </p>
                <ul className="space-y-2">
                  {[
                    'Lifetime access',
                    'Certificate of completion',
                    '24/7 support',
                    'Mobile and desktop access',
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;