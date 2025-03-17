import { useState } from "react";

export default function HomePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle mood selection
  const handleMoodSelection = async (mood: "good" | "bad"): Promise<void> => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First, we need to create a response for the survey
      const responseData = await fetch("http://localhost:3000/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId: "mood-survey", 
        }),
      });
      
      const response = await responseData.json();
      
      // Then create an answer for this response
      await fetch("http://localhost:3000/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          responseId: response.id,
          questionId: "mood-question", 
          textValue: mood,
        }),
      });
      
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to submit your response. Please try again.");
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