import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { Clock, BarChart, User, ArrowRight, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'free', 'paid'

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data.courses);
      toast.success('Courses loaded successfully!');
    } catch (error) {
      toast.error('Failed to load courses');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'free' && course.price === 0) ||
      (filterType === 'paid' && course.price > 0);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="skeleton h-48 w-full mb-4 rounded-xl"></div>
                <div className="skeleton h-6 w-3/4 mb-3"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in text-gray-800">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Discover Your Next Course
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Master new skills with our expertly crafted courses. Start learning today!
            </p>
            
            {/* Black Friday Banner */}
            <div className="inline-flex items-center bg-accent-500 text-gray-500 px-6 py-3 rounded-full font-bold text-lg shadow-xl animate-bounce-slow">
               Black Friday Sale! Use code <code className="mx-2 bg-gray-200 px-3 py-1 text-gray-800 rounded">BFSALE25</code> for 50% OFF
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses by title, description, or category..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Courses' },
                { value: 'free', label: 'Free' },
                { value: 'paid', label: 'Paid' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    filterType === filter.value
                      ? 'bg-primary-600 text-gray-800 shadow-xl border-primary-600'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-50 border-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <Link
                key={course._id}
                to={`/course/${course._id}`}
                className="card card-hover group animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
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
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    {course.price === 0 ? (
                      <span className="badge badge-free shadow-lg">FREE</span>
                    ) : (
                      <span className="badge badge-free text-primary-600 shadow-lg font-extrabold">
                        ${course.price}
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="badge badge-free bg-white/90 text-gray-900 shadow-md">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart className="w-4 h-4" />
                      <span>{course.level}</span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{course.instructor}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;