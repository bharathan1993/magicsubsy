import { Variants } from "framer-motion";

// Animation variants for common UI patterns
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const textRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const bounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export const pulseVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

// Custom animation hooks
export const defaultTransition = {
  duration: 0.6,
  ease: "easeOut"
};

export const slowTransition = {
  duration: 0.8,
  ease: "easeInOut"
};

export const fastTransition = {
  duration: 0.3,
  ease: "easeOut"
};

// Celebration animation variants
export const celebrationVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const confettiVariants: Variants = {
  hidden: { y: -100, opacity: 0, rotate: 0 },
  visible: {
    y: window.innerHeight + 100,
    opacity: [0, 1, 1, 0],
    rotate: 720,
    transition: {
      duration: 3,
      ease: "easeIn"
    }
  }
};

export const sparkleVariants: Variants = {
  hidden: { scale: 0, rotate: 0, opacity: 0 },
  visible: {
    scale: [0, 1.5, 1, 1.2, 0],
    rotate: [0, 180, 360],
    opacity: [0, 1, 1, 1, 0],
    transition: {
      duration: 2,
      ease: "easeInOut"
    }
  }
};

export const burstVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 2, 1.5, 0],
    opacity: [0, 1, 0.8, 0],
    transition: {
      duration: 1.5,
      ease: "easeOut"
    }
  }
};

export const floatingTextVariants: Variants = {
  hidden: { y: 50, opacity: 0, scale: 0.5 },
  visible: {
    y: -50,
    opacity: [0, 1, 1, 0],
    scale: [0.5, 1.2, 1, 0.8],
    transition: {
      duration: 2,
      ease: "easeOut"
    }
  }
};

export const radiatingCircleVariants: Variants = {
  hidden: { scale: 0, opacity: 1 },
  visible: {
    scale: 3,
    opacity: 0,
    transition: {
      duration: 1.5,
      ease: "easeOut"
    }
  }
};