import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FaHome, FaSearch, FaRocket } from 'react-icons/fa';

const NotFoundPage = () => {
  const numberRef = useRef(null);
  const rocketRef = useRef(null);

  useEffect(() => {
    // Animate the 404 number
    gsap.fromTo(numberRef.current, 
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }
    );

    // Floating rocket animation
    gsap.to(rocketRef.current, {
      y: "-20px",
      rotation: "5deg",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 px-4 max-w-2xl mx-auto">
        {/* 404 Number */}
        <motion.div 
          ref={numberRef}
          className="text-9xl md:text-[200px] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 leading-none"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "back.out(1.7)" }}
        >
          404
        </motion.div>

        {/* Rocket */}
        <motion.div 
          ref={rocketRef}
          className="text-6xl mb-8"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          🚀
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Oops! Page Not Found
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-xl text-gray-600 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Looks like this page took a detour! Let's get you back on track to explore Bhubaneswar's amazing destinations.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <Link 
            to="/" 
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <FaHome className="mr-3" />
            Go Home
            <motion.div
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </Link>
          
          <Link 
            to="/search" 
            className="group inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            <FaSearch className="mr-3" />
            Explore Places
          </Link>
        </motion.div>

        {/* Fun Fact */}
        <motion.div 
          className="mt-16 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Did you know?</h3>
          <p className="text-gray-600">
            Bhubaneswar has over 700 temples and is known as the "Temple City of India"! 
            Start exploring to discover these hidden gems.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
