import React from "react";
import { motion } from "framer-motion";

function Loader({ message = "Loading beautiful designs..." }) {
  return (
    <div className="app-loader">
      <motion.div
        className="loader-ring"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <span className="loader-gem">◆</span>
      </motion.div>
      <motion.p
        className="loader-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
      >
        {message}
      </motion.p>
    </div>
  );
}

export default Loader;