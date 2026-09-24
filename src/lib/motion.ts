import { Variants, Transition } from "framer-motion";

// Luxury Easing Curves
export const EASING_LUXURY = [0.22, 1, 0.36, 1] as const;
export const EASING_EDITORIAL = [0.25, 1, 0.5, 1] as const;
export const EASING_SMOOTH = [0.4, 0.0, 0.2, 1] as const;
export const EASING_GENTLE = [0.16, 1, 0.3, 1] as const;

// Duration Constants (in seconds)
export const DURATION_FAST = 0.2;
export const DURATION_NORMAL = 0.45;
export const DURATION_SLOW = 0.8;
export const DURATION_EDITORIAL = 1.0;

// Standard Transitions
export const luxuryTransition: Transition = {
  duration: DURATION_NORMAL,
  ease: EASING_LUXURY,
};

export const editorialTransition: Transition = {
  duration: DURATION_SLOW,
  ease: EASING_EDITORIAL,
};

export const fastTransition: Transition = {
  duration: DURATION_FAST,
  ease: EASING_SMOOTH,
};

export const gentleTransition: Transition = {
  duration: DURATION_EDITORIAL,
  ease: EASING_GENTLE,
};

// Viewport trigger settings for scroll animations
export const defaultViewport = {
  once: true,
  amount: 0.15,
};

// Animation Variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: luxuryTransition,
  },
  exit: {
    opacity: 0,
    transition: fastTransition,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_SLOW,
      ease: EASING_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: fastTransition,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_SLOW,
      ease: EASING_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: fastTransition,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION_SLOW,
      ease: EASING_LUXURY,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION_SLOW,
      ease: EASING_LUXURY,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_SLOW,
      ease: EASING_LUXURY,
    },
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION_SLOW,
      ease: EASING_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: fastTransition,
  },
};

export const cardHoverVariants = {
  rest: { y: 0, transition: luxuryTransition },
  hover: { y: -6, transition: luxuryTransition },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: DURATION_NORMAL,
      ease: EASING_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: {
      duration: DURATION_FAST,
      ease: EASING_SMOOTH,
    },
  },
};

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      duration: DURATION_NORMAL,
      ease: EASING_LUXURY,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: DURATION_FAST,
      ease: EASING_SMOOTH,
    },
  },
};

