import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

/**
 * Enhanced motion wrapper with accessibility support
 * Respects user's prefers-reduced-motion setting
 */

// Motion variants for different animation types
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export const cardVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const slideInVariants = {
  initial: {
    x: -100,
    opacity: 0
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export const floatingVariants = {
  initial: {
    y: 0
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

/**
 * MotionWrapper component for page-level animations
 */
export const MotionWrapper = ({ children, className = "", ...props }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion ? {} : pageVariants;
  
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * AnimatedCard component for card animations
 */
export const AnimatedCard = ({ children, className = "", onClick, ...props }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion ? {} : cardVariants;
  
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover={shouldReduceMotion ? {} : "hover"}
      whileTap={shouldReduceMotion ? {} : "tap"}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * SlideInSection for section animations
 */
export const SlideInSection = ({ children, className = "", delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion ? {} : {
    ...slideInVariants,
    animate: {
      ...slideInVariants.animate,
      transition: {
        ...slideInVariants.animate.transition,
        delay
      }
    }
  };
  
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggeredContainer for staggered children animations
 */
export const StaggeredContainer = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion ? {} : staggerContainer;
  
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

/**
 * FloatingElement for subtle floating animations
 */
export const FloatingElement = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion ? {} : floatingVariants;
  
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

export { AnimatePresence };
export default MotionWrapper;
