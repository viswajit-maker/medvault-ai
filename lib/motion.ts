// MedVault AI easing: Snappy, precise, hardware-device-like, no bouncy fluff
export const crispEasing = [0.16, 1, 0.3, 1];

export const motionVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.3, ease: crispEasing }
  },
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // faster stagger for data cascades
        delayChildren: 0.05
      }
    }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.25, ease: crispEasing }
  },
  slideInRight: {
    initial: { opacity: 0, x: 15 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 15 },
    transition: { duration: 0.3, ease: crispEasing }
  }
};
