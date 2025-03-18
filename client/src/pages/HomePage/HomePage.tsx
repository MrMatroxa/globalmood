import { useState, useEffect, useRef } from "react";
import axios from "axios";

const SERVER_URL: string = import.meta.env.VITE_SERVER_URL;

export default function HomePage() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const userInitialized = useRef(false);
  // Add state for mood statistics
  const [moodStats, setMoodStats] = useState<{ good: number; bad: number }>({
    good: 0,
    bad: 0,
  });

  // Add these new states to your component
  const [comparisonPeriod, setComparisonPeriod] = useState<string | null>(null);
  const [compareData, setCompareData] = useState<{
    [key: string]: { good: number; bad: number };
  }>({
    today: { good: 0, bad: 0 },
  });

  // Get or create user on component mount
  useEffect(() => {
    const getUserOrCreate = async () => {
      // Skip if we've already initialized the user
      if (userInitialized.current) return;

      try {
        // Get client IP address (in production you'd use a more reliable service)
        const { data: ipData } = await axios.get(
          "https://api.ipify.org?format=json"
        );
        const ip = ipData.ip;

        // Create or get user
        const { data: userData } = await axios.post(`${SERVER_URL}/api/users`, {
          ip,
        });
        setUserId(userData.id);
        userInitialized.current = true;
      } catch (err) {
        console.error("Failed to initialize user:", err);
      }
    };

    getUserOrCreate();
  }, []);

  // Function to fetch mood statistics
  const fetchMoodStats = async (
    period: string = "today",
    comparison: string | null = null
  ) => {
    try {
      let url = `${SERVER_URL}/api/statistics/mood?period=${period}`;
      if (comparison) {
        url += `&comparison=${comparison}`;
      }

      const { data } = await axios.get(url);
      setMoodStats(data.today || data[period]);
      setCompareData(data);
    } catch (err) {
      console.error("Failed to fetch mood statistics:", err);
    }
  };

  // Add a function to handle period selection
  const handlePeriodChange = (
    period: string,
    comparison: string | null = null
  ) => {
    setComparisonPeriod(comparison);
    fetchMoodStats(period, comparison);
  };

  // Function to handle mood selection
  const handleMoodSelection = async (mood: "good" | "bad"): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // First, we need to create a response for the survey
      const { data: response } = await axios.post(
        `${SERVER_URL}/api/responses`,
        {
          surveyId: "mood-survey",
          userId: userId, // Include userId if available
        }
      );

      // Then create an answer for this response with the selected option
      const { data: answer } = await axios.post(`${SERVER_URL}/api/answers`, {
        responseId: response.id,
        questionId: "mood-question-1",
      });

      // Create the selected option for the answer
      await axios.post(`${SERVER_URL}/api/selected-options`, {
        answerId: answer.id,
        value: mood,
      });

      // Fetch the latest mood statistics after successful submission
      await fetchMoodStats();

      setIsSubmitted(true);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? `Error ${err.response?.status}: ${
            err.response?.data?.message || err.message
          }`
        : "An unexpected error occurred";

      setError(
        `Failed to submit your response. Please try again. ${errorMessage}`
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const total = moodStats.good + moodStats.bad || 1; // Avoid division by zero
    const goodPercentage = (moodStats.good / total) * 100;
    const badPercentage = (moodStats.bad / total) * 100;

    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-lg shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Thank you for your response!
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Your mood has been recorded.
        </p>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Today's Mood Statistics
        </h3>
        <div className="mb-2">
          <div className="h-8 w-full bg-gray-200 rounded-md overflow-hidden flex">
            <div
              className="h-full bg-green-500 flex items-center justify-center text-white font-medium"
              style={{ width: `${goodPercentage}%` }}
            >
              {moodStats.good > 0 && `${goodPercentage.toFixed(0)}%`}
            </div>
            <div
              className="h-full bg-red-500 flex items-center justify-center text-white font-medium"
              style={{ width: `${badPercentage}%` }}
            >
              {moodStats.bad > 0 && `${badPercentage.toFixed(0)}%`}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-2 gap-8">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
            <span>Good: {moodStats.good}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
            <span>Bad: {moodStats.bad}</span>
          </div>
        </div>

        {/* Period selection buttons */}
        <div className="mt-6 mb-4">
          <h4 className="text-lg font-semibold mb-2">Compare with:</h4>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handlePeriodChange("today")}
              className={`px-3 py-1 rounded ${
                !comparisonPeriod ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Just Today
            </button>
            <button
              onClick={() => handlePeriodChange("today", "yesterday")}
              className={`px-3 py-1 rounded ${
                comparisonPeriod === "yesterday"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => handlePeriodChange("today", "week")}
              className={`px-3 py-1 rounded ${
                comparisonPeriod === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Last Week
            </button>
          </div>
        </div>

        {/* Show comparison chart if comparison period is selected */}
        {comparisonPeriod && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">
              Comparison: Today vs{" "}
              {comparisonPeriod === "yesterday" ? "Yesterday" : "Last Week"}
            </h4>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {/* Today's chart */}
              <div>
                <h5 className="text-sm font-medium mb-1">Today</h5>
                <div className="h-8 w-full bg-gray-200 rounded-md overflow-hidden flex">
                  {/* Same chart rendering as before */}
                </div>
                <div className="text-xs mt-1">
                  Good: {compareData.today?.good || 0} | Bad:{" "}
                  {compareData.today?.bad || 0}
                </div>
              </div>

              {/* Comparison period chart */}
              <div>
                <h5 className="text-sm font-medium mb-1">
                  {comparisonPeriod === "yesterday" ? "Yesterday" : "Last Week"}
                </h5>
                <div className="h-8 w-full bg-gray-200 rounded-md overflow-hidden flex">
                  {/* Similar chart rendering for comparison data */}
                  {/* You can extract the chart into a reusable component */}
                </div>
                <div className="text-xs mt-1">
                  Good: {compareData[comparisonPeriod]?.good || 0} | Bad:{" "}
                  {compareData[comparisonPeriod]?.bad || 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Global Mood Survey
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">
        How do you feel today?
      </h2>

      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => handleMoodSelection("good")}
          disabled={isSubmitting}
          className="px-8 py-4 text-xl font-medium bg-green-500 text-white rounded-lg 
                     hover:bg-green-600 hover:-translate-y-1 hover:shadow-lg transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Good 😊
        </button>

        <button
          onClick={() => handleMoodSelection("bad")}
          disabled={isSubmitting}
          className="px-8 py-4 text-xl font-medium bg-red-500 text-white rounded-lg 
                     hover:bg-red-600 hover:-translate-y-1 hover:shadow-lg transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Bad 😔
        </button>
      </div>

      {isSubmitting && (
        <p className="mt-4 text-gray-600">Submitting your response...</p>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
