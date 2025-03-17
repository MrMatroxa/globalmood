import { useState, useEffect } from "react";
import axios from 'axios';

const SERVER_URL: string = import.meta.env.VITE_SERVER_URL

export default function HomePage() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get or create user on component mount
  useEffect(() => {
    const getUserOrCreate = async () => {
      try {
        // Get client IP address (in production you'd use a more reliable service)
        const { data: ipData } = await axios.get("https://api.ipify.org?format=json");
        const ip = ipData.ip;

        // Create or get user
        const { data: userData } = await axios.post(`${SERVER_URL}/api/users`, { ip });
        setUserId(userData.id);
      } catch (err) {
        console.error("Failed to initialize user:", err);
      }
    };

    getUserOrCreate();
  }, []);

  // Function to handle mood selection
  const handleMoodSelection = async (mood: "good" | "bad"): Promise<void> => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First, we need to create a response for the survey
      const { data: response } = await axios.post(`${SERVER_URL}/api/responses`, {
        surveyId: "mood-survey",
        userId: userId, // Include userId if available
      });
      
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
      
      setIsSubmitted(true);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? `Error ${err.response?.status}: ${err.response?.data?.message || err.message}`
        : 'An unexpected error occurred';
      
      setError(`Failed to submit your response. Please try again. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-lg shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank you for your response!</h2>
        <p className="text-xl text-gray-600">Your mood has been recorded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Global Mood Survey</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">How do you feel today?</h2>
      
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
      
      {isSubmitting && <p className="mt-4 text-gray-600">Submitting your response...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}