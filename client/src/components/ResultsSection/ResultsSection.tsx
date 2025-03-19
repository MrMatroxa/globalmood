import { motion, AnimatePresence } from "framer-motion";
import ComparisonButton from "../ComparisonButton/ComparisonButton";
import ComparisonChart from "../ComparisonChart/ComparisonChart";
import { FaGlobe } from "react-icons/fa";

interface ResultsSectionProps {
  alreadyVoted: boolean;
  moodStats: { good: number; bad: number };
  comparisonPeriod: string | null;
  compareData: { [key: string]: { good: number; bad: number } };
  handlePeriodChange: (period: string, comparison?: string | null) => void;
  userCountryName: string | null;
  showCountryStats: boolean;
  toggleCountryStats: () => void;
}

export default function ResultsSection({
  alreadyVoted,
  moodStats,
  comparisonPeriod,
  compareData,
  handlePeriodChange,
  userCountryName,
  showCountryStats,
  toggleCountryStats,
}: ResultsSectionProps) {
  const total = moodStats.good + moodStats.bad || 1;
  const goodPercentage = (moodStats.good / total) * 100;
  const badPercentage = (moodStats.bad / total) * 100;

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
        className="text-2xl font-bold text-gray-800 mb-3 text-center"
      >
        {alreadyVoted
          ? "You've already shared your mood today"
          : "Thank you for sharing your mood!"}
      </motion.h2>

      {/* Add the view toggle buttons right after the heading */}
      {userCountryName && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex justify-center gap-3 mb-6"
        >
          <motion.button
            onClick={() => {
              if (showCountryStats) toggleCountryStats();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              !showCountryStats
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaGlobe className="mr-2" /> Global View
          </motion.button>

          <motion.button
            onClick={() => {
              if (!showCountryStats) toggleCountryStats();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              showCountryStats
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <span className="mr-2">🏠</span> {userCountryName} View
          </motion.button>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 mb-8 text-center"
      >
       {showCountryStats
    ? `Here's how your country is feeling`
    : `Here's how the world is feeling`}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Today's Mood
        </h3>

        <div className="relative h-16 bg-gray-100 rounded-xl overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${goodPercentage}%` }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: 0.4,
            }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center"
          >
            {goodPercentage > 8 && (
              <div className="text-white font-medium px-4">
                {goodPercentage.toFixed(0)}% Good
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${badPercentage}%` }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: 0.5,
            }}
            className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center"
          >
            {badPercentage > 8 && (
              <div className="text-white font-medium px-4">
                {badPercentage.toFixed(0)}% Bad
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex justify-around mt-3 text-sm">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
            <span>{moodStats.good} people feeling good</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
            <span>{moodStats.bad} people feeling bad</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-4 text-center"
      >
        <h4 className="text-gray-700 font-medium">
          {showCountryStats
            ? `Showing data for ${userCountryName}`
            : "Showing global data"}
        </h4>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-6"
      >
        <h4 className="text-gray-700 font-medium mb-2 flex items-center justify-center">
          Compare with
        </h4>
        <div className="flex flex-wrap justify-center gap-2">
          <ComparisonButton
            isActive={!comparisonPeriod}
            onClick={() => handlePeriodChange("today")}
            label="Just Today"
          />
          <ComparisonButton
            isActive={comparisonPeriod === "yesterday"}
            onClick={() => handlePeriodChange("today", "yesterday")}
            label="Yesterday"
          />
          <ComparisonButton
            isActive={comparisonPeriod === "week"}
            onClick={() => handlePeriodChange("today", "week")}
            label="Last Week"
          />
          <ComparisonButton
            isActive={comparisonPeriod === "month"}
            onClick={() => handlePeriodChange("today", "month")}
            label="Last Month"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {comparisonPeriod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mt-6 bg-gray-50 p-4 rounded-xl"
          >
            <h4 className="text-lg font-medium text-gray-700 mb-4 text-center">
              Today vs{" "}
              {comparisonPeriod === "yesterday"
                ? "Yesterday"
                : comparisonPeriod === "week"
                ? "Last Week"
                : "Last Month"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ComparisonChart
                title="Today"
                data={compareData.today || { good: 0, bad: 0 }}
              />

              <ComparisonChart
                title={
                  comparisonPeriod === "yesterday"
                    ? "Yesterday"
                    : comparisonPeriod === "week"
                    ? "Last Week"
                    : "Last Month"
                }
                data={compareData[comparisonPeriod] || { good: 0, bad: 0 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
