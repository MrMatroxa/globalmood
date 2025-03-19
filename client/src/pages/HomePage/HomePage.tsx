import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe } from "react-icons/fa";
import VotingSection from "../../components/VotingSection/VotingSection";
import ResultsSection from "../../components/ResultsSection/ResultsSection";
import "./HomePage.css";
// Import the country library
import countries from "i18n-iso-countries";
// Import English locale data
import en from "i18n-iso-countries/langs/en.json";

// Initialize the library with locale data
countries.registerLocale(en);

const SERVER_URL: string = import.meta.env.VITE_SERVER_URL;

interface MoodStats {
  good: number;
  bad: number;
}

interface CompareData {
  [key: string]: MoodStats;
}

export default function HomePage() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userCountryName, setUserCountryName] = useState<string | null>(null);
  const [showCountryStats, setShowCountryStats] = useState<boolean>(false);

  const userInitialized = useRef(false);

  const [moodStats, setMoodStats] = useState<MoodStats>({
    good: 0,
    bad: 0,
  });

  const [comparisonPeriod, setComparisonPeriod] = useState<string | null>(null);
  const [compareData, setCompareData] = useState<CompareData>({
    today: { good: 0, bad: 0 },
  });

  const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false);

  useEffect(() => {
    const getUserOrCreate = async () => {
      if (userInitialized.current) return;

      try {
        const { data: ipData } = await axios.get(
          "https://api.ipify.org?format=json"
        );
        const ip = ipData.ip;
        const ipToken = import.meta.env.VITE_IP_INFO_TOKEN;

        const { data: ipInfo } = await axios.get(
          `https://ipinfo.io/${ip}?token=${ipToken}`
        );
        const country = ipInfo.country;

        // Convert country code to full name
        const countryName = countries.getName(country, "en") || country;
        setUserCountry(country);
        setUserCountryName(countryName);

        const { data: userData } = await axios.post(`${SERVER_URL}/api/users`, {
          ip,
          country,
        });
        setUserId(userData.id);
        userInitialized.current = true;

        await checkUserVoted(userData.id);
      } catch (err) {
        console.error("Failed to initialize user:", err);
      }
    };

    getUserOrCreate();
  }, []);

  const checkUserVoted = async (userId: string) => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/responses/check/${userId}`
      );
      if (data.alreadyVoted) {
        setAlreadyVoted(true);
        setIsSubmitted(true);
        await fetchMoodStats();
      }
    } catch (err) {
      console.error("Failed to check user voting status:", err);
    }
  };

  const fetchMoodStats = async (
    period: string = "today",
    comparison: string | null = null,
    countryStatsOverride?: boolean 
  ) => {
    try {
      let url = `${SERVER_URL}/api/statistics/mood?period=${period}`;
      if (comparison) {
        url += `&comparison=${comparison}`;
      }

      // Use the override value if provided, otherwise use the state value
      const useCountryStats =
        countryStatsOverride !== undefined
          ? countryStatsOverride
          : showCountryStats;

      // Add country filter if user wants to see country-specific stats
      if (useCountryStats && userCountry) {
        url += `&country=${userCountry}`;
      }

      const { data } = await axios.get(url);
      setMoodStats(data.today || data[period]);
      setCompareData(data);
    } catch (err) {
      console.error("Failed to fetch mood statistics:", err);
    }
  };

  const handlePeriodChange = (
    period: string,
    comparison: string | null = null
  ) => {
    setComparisonPeriod(comparison);
    fetchMoodStats(period, comparison);
  };

  const toggleCountryStats = () => {
    const newShowCountryStats = !showCountryStats;
    setShowCountryStats(newShowCountryStats);

    // Use the new value directly instead of relying on state update
    fetchMoodStats("today", comparisonPeriod, newShowCountryStats);
  };

  const handleMoodSelection = async (mood: "good" | "bad"): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: response } = await axios.post(
        `${SERVER_URL}/api/responses`,
        {
          surveyId: "mood-survey",
          userId: userId,
        }
      );

      const { data: answer } = await axios.post(`${SERVER_URL}/api/answers`, {
        responseId: response.id,
        questionId: "mood-question-1",
      });

      await axios.post(`${SERVER_URL}/api/selected-options`, {
        answerId: answer.id,
        value: mood,
      });

      await fetchMoodStats();
      setIsSubmitted(true);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 403 &&
        err.response?.data?.alreadyVoted
      ) {
        setAlreadyVoted(true);
        setIsSubmitted(true);
        await fetchMoodStats();
      } else {
        const errorMessage = axios.isAxiosError(err)
          ? `Error ${err.response?.status}: ${
              err.response?.data?.message || err.message
            }`
          : "An unexpected error occurred";

        setError(
          `Failed to submit your response. Please try again. ${errorMessage}`
        );
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Globe header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="absolute right-6 top-6 text-4xl opacity-40"
          >
            <FaGlobe />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-2"
          >
            Global Mood
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-100"
          >
            How are people feeling around the world today?
          </motion.p>
        </div>

        {/* Content section */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <VotingSection
                key="voting"
                handleMoodSelection={handleMoodSelection}
                isSubmitting={isSubmitting}
                error={error}
              />
            ) : (
              <ResultsSection
                key="results"
                alreadyVoted={alreadyVoted}
                moodStats={moodStats}
                comparisonPeriod={comparisonPeriod}
                compareData={compareData}
                handlePeriodChange={handlePeriodChange}
                userCountryName={userCountryName}
                showCountryStats={showCountryStats}
                toggleCountryStats={toggleCountryStats}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Attribution footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-gray-500 text-xs mt-6"
      >
        © {new Date().getFullYear()} Global Mood Survey
      </motion.p>
    </div>
  );
}
