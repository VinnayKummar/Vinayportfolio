import { Children } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const childVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease },
  },
};

export default function Section({ children, delay = 0 }) {
  const items = Children.toArray(children);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.88,
            ease,
            delay,
            staggerChildren: 0.12,
            delayChildren: 0.06,
          },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-96px" }}
    >
      {items.map((child, index) => (
        <motion.div key={`section-item-${index}`} variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
