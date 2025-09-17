import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronDown, Phone, Calendar, Calculator, BookOpen, BarChart3 } from "lucide-react";

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of SAT practice tests are available?",
      answer: "We offer comprehensive SAT practice tests including full-length tests, section-specific practice, and adaptive quizzes. Our tests cover Math, Reading, Writing & Language sections with detailed explanations."
    },
    // {
    //   question: "How are the test papers curated?",
    //   answer: "Our SAT test papers are curated from multiple trusted sources including College Board official materials, Khan Academy, and other reputable test prep organizations to ensure quality and accuracy."
    // },
    {
      question: "Can I track my progress over time?",
      answer: "Yes! Our platform provides detailed analytics showing your score improvements, strengths, weaknesses, and personalized recommendations for areas to focus on."
    },
    {
      question: "Are the practice tests timed like the real SAT?",
      answer: "Absolutely. All our practice tests simulate real SAT conditions with proper timing for each section, helping you build stamina and time management skills."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently, our platform is web-based and fully responsive, working seamlessly on all devices including smartphones and tablets. A dedicated mobile app is in development."
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 w-full rounded-b-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="https://10xlearningacademy.com/assets/images/logo-learn2.png" 
                alt="Logo" 
                width={220} 
                className="dark:invert" 
              />
            </div>
            
            {/* Navigation */}
            {/* <nav className="hidden md:flex items-center space-x-8">
              <a href="#subjects" className="text-gray-700 hover:text-[#7a6ad8] font-medium">SUBJECTS</a>
              <a href="#practice-tests" className="text-gray-700 hover:text-[#7a6ad8] font-medium">PRACTICE TESTS</a>
              <Link to="/signup" className="text-gray-700 hover:text-[#7a6ad8] font-medium font-semibold">ENROLL NOW!</Link>
              <Link to="/login" className="text-gray-700 hover:text-[#7a6ad8] font-medium">ADMIN</Link>
            </nav> */}
            
            {/* Contact Buttons */}
            <div className="flex items-center space-x-3">
              <Link to="/signup">
                <button className="flex items-center space-x-2 bg-[#7a6ad8] text-white px-6 py-3 rounded-full hover:bg-[#6b5bc7] transition-colors">
                  <span className="font-medium">Sign Up</span>
                </button>
              </Link>
              <Link to="/login">
                <button className="flex items-center space-x-2 border-2 border-[#7a6ad8] text-[#7a6ad8] px-6 py-3 rounded-full hover:bg-[#7a6ad8] hover:text-white transition-colors">
                  <span className="font-medium">Login</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master the{" "}
            <span className="text-[#7a6ad8]">SAT</span>
            {" "}with Confidence
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The most complete SAT practice experience with expertly designed tests, smart analytics, and personalized feedback to help you score higher.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/signup">
              <button className="bg-[#7a6ad8] text-white px-6 py-3 rounded-full hover:bg-[#6b5bc7] transition-colors text-lg font-semibold">
                Start Practicing Now
              </button>
            </Link>
            <Link to="/login">
              <button className="border-2 border-[#7a6ad8] text-[#7a6ad8] px-8 py-3 rounded-full hover:bg-[#7a6ad8] hover:text-white transition-colors text-lg font-semibold">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* About Career Button */}
        <div className="text-center mb-20">
          <Link to="/signup">
            {/* <button className="bg-[#7a6ad8] text-white px-8 py-4 rounded-full hover:bg-[#6b5bc7] transition-colors text-lg font-semibold">
              About Career
            </button> */}
          </Link>
        </div>

        {/* Features Section */}
        <div id="subjects" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <div className="w-20 h-20 bg-[#7a6ad8] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Math Section</h3>
            <p className="text-gray-600 text-lg">
              Comprehensive math practice covering algebra, geometry, trigonometry, and advanced topics with step-by-step solutions.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
            <div className="w-20 h-20 bg-[#7a6ad8] rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Reading & Writing</h3>
            <p className="text-gray-600 text-lg">
              Master reading comprehension and writing skills with passages from literature, science, and social studies.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
            <div className="w-20 h-20 bg-[#7a6ad8] rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Performance Analytics</h3>
            <p className="text-gray-600 text-lg">
              Track your progress with detailed analytics, identify weak areas, and get personalized study recommendations.
            </p>
          </div>
        </div>

        {/* Practice Tests Section */}
        <div id="practice-tests" className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Curated SAT Practice Tests</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
          Every practice test is built on proven materials from leading SAT resources, enhanced with analytics and feedback to give you the most effective preparation.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#7a6ad8] transition-colors">
              <h4 className="font-bold text-lg mb-2">Full-Length Tests</h4>
              <p className="text-gray-600">Complete 3-hour practice tests that mirror the real SAT experience</p>
            </div>
            <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#7a6ad8] transition-colors">
              <h4 className="font-bold text-lg mb-2">Section Practice</h4>
              <p className="text-gray-600">Focus on specific sections to target your weak areas</p>
            </div>
            <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#7a6ad8] transition-colors">
              <h4 className="font-bold text-lg mb-2">Adaptive Quizzes</h4>
              <p className="text-gray-600">Smart quizzes that adapt to your skill level and progress</p>
            </div>
            <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#7a6ad8] transition-colors">
              <h4 className="font-bold text-lg mb-2">Detailed Explanations</h4>
              <p className="text-gray-600">Comprehensive explanations for every question and answer choice</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-lg text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#7a6ad8] transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-12 bg-gradient-to-r from-[#7a6ad8] to-[#6b5bc7] rounded-3xl text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Ace the SAT?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who have improved their SAT scores with our comprehensive practice platform
          </p>
          <Link to="/signup">
            <button className="bg-white text-[#7a6ad8] px-10 py-4 rounded-full hover:bg-gray-100 transition-colors  font-semibold">
              Start Your Free Practice
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            {/* <img 
              src="https://10xlearningacademy.com/assets/images/logo-learn2.png" 
              alt="Logo" 
              width={200} 
              className="mx-auto mb-6" 
            /> */}
            {/* <p className="text-gray-600 mb-4">Empowering students to achieve their SAT goals</p> */}
            <p className="text-gray-500">&copy; 2025 10xlearningacademy SAT.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
