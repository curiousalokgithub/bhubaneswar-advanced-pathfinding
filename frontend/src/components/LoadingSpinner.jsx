import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = "Loading amazing places..." }) => {
  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div 
          className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <span className="text-3xl">🚀</span>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex space-x-2 justify-center mb-6">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.p 
          className="text-lg text-gray-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full mt-6 mx-auto overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
