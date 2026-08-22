import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { easing } from '../utils/animations';

interface AnimatedPageProps {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easing.out } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: easing.inOut } },
};

export function AnimatedPage({ children }: AnimatedPageProps): JSX.Element {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
