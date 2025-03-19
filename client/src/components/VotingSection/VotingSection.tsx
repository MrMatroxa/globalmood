import { motion } from "framer-motion";

interface VotingSectionProps {
  handleMoodSelection: (mood: "good" | "bad") => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export default function VotingSection({
  handleMoodSelection,
  isSubmitting,
  error,
}: VotingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-2xl font-semibold text-gray-800 mb-8 text-center"
      >
        How do you feel today?
      </motion.h2>

      <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
        <motion.button
          onClick={() => handleMoodSelection("good")}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05, backgroundColor: "#22c55e" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="mood-button good-button"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-4xl mb-2"
          >
            😊
          </motion.span>
          <span>Good</span>
        </motion.button>

        <motion.button
          onClick={() => handleMoodSelection("bad")}
          disabled={isSubmitting}
          whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="mood-button bad-button"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="text-4xl mb-2"
          >
            😔
          </motion.span>
          <span>Bad</span>
        </motion.button>
      </div>

      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex justify-center"
        >
          <div className="loader"></div>
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-red-500 bg-red-50 p-3 rounded-lg text-center"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}