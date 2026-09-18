import React from "react";
import { motion } from "framer-motion";

function Loader({ message = "Finding your sparkle..." }) {
  return (
    <div className="app-loader">
      <div className="loader-scene">
        {/* orbiting sparkles */}
        <motion.div
          className="loader-orbit"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        >
          <motion.span
            className="loader-sparkle tl"
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
          <motion.span
            className="loader-sparkle br"
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.75,
            }}
          >
            ✦
          </motion.span>
        </motion.div>

        {/* rotating gold ring */}
        <div className="loader-ring">
          <motion.span
            className="loader-ring-dots"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
          ></motion.span>
          {/* glowing gem */}
          <motion.span
            className="loader-gem"
            animate={{
              scale: [1, 1.35, 1],
              rotate: [0, 180, 360],
              textShadow: [
                "0 0 6px rgba(212,175,55,.5)",
                "0 0 22px rgba(212,175,55,.95)",
                "0 0 6px rgba(212,175,55,.5)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ◆
          </motion.span>
        </div>
      </div>

      <motion.p
        className="loader-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.9 }}
      >
        {message}
      </motion.p>
    </div>
  );
}

export default Loader;