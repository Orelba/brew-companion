import { motion } from 'framer-motion'

const PageTransitionWrapper = ({ children }) => {
  const durationInSeconds = 0.17

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: durationInSeconds,
      }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransitionWrapper
