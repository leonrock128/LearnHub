import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionAPI } from '../services/api';
import { Calendar, DollarSign, BookOpen, ArrowRight, Tag, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await subscriptionAPI.getMyCourses();
      setCourses(response.data.courses);
      
      if (response.data.courses.length > 0) {
        toast.success('Your courses loaded successfully!');
      }
    } catch (error) {
      toast.error('Failed to load your courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="skeleton h-12 w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="skeleton h-48 w-full mb-4 rounded-xl"></div>
                <div className="skeleton h-6 w-3/4 mb-3"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-gradient-primary text-gray-500 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 text-gray-800">My Courses</h1>
            <p className="text-xl text-gray-600 mb-6">
              Continue your learning journey
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold">
                    {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Enrolled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {courses.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No courses yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Start exploring our course catalog to begin your learning journey!
            </p>
            <Link to="/home" className="btn-primary inline-flex items-center space-x-2">
              <span>Browse Courses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((item, index) => {
              const course = item.course;
              const wasFree = item.pricePaid === 0;
              
              return (
                <div
                  key={item.subscriptionId}
                  className="card group hover:shadow-2xl transition-all duration-300 animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Course Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {course.title.charAt(0)}
                      </div>
                    )}
                    
                    {/* Enrolled Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="badge badge-free bg-green-500 text-white shadow-lg">
                         Enrolled
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Subscription Details */}
                    <div className="space-y-3 mb-4">
                      {/* Price Paid */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>Amount Paid:</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {wasFree ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            `$${item.pricePaid.toFixed(2)}`
                          )}
                        </span>
                      </div>

                      {/* Discount Info */}
                      {item.discountApplied > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Original Price:</span>
                            <span className="text-gray-500 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-green-700">
                              <Tag className="w-4 h-4" />
                              <span className="font-semibold">{item.promoCode}</span>
                            </div>
                            <span className="text-green-700 font-bold">
                              -${item.discountApplied.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Enrollment Date */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Enrolled:</span>
                        </div>
                        <span className="text-gray-700 font-medium">
                          {formatDate(item.subscribedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Continue Learning Button */}
                    <Link
                      to={`/course/${course._id}`}
                      className="w-full btn-primary flex items-center justify-center space-x-2 text-sm"
                    >
                      <span>View Course</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Card */}
        {courses.length > 0 && (
          <div className="mt-12 card p-8 animate-slide-up animation-delay-400">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Learning Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">{courses.length}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <DollarSign className="w-8 h-8 text-green-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${courses.reduce((sum, item) => sum + item.pricePaid, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Invested</p>
              </div>
              
              <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-6 rounded-xl">
                <Tag className="w-8 h-8 text-accent-600 mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${courses.reduce((sum, item) => sum + item.discountApplied, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Saved</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;