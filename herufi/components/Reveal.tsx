'use client'

import { motion, useReducedMotion } from 'motion/react'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

/** Lifts content into view the first time it scrolls on screen. Static under prefers-reduced-motion. */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
