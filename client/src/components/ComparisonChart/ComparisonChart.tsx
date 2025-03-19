import { motion } from "framer-motion";

interface ComparisonChartProps {
  title: string;
  data: { good: number; bad: number };
}

export default function ComparisonChart({ title, data }: ComparisonChartProps) {
  const total = data.good + data.bad || 1;
  const goodPercentage = (data.good / total) * 100;
  const badPercentage = (data.bad / total) * 100;

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <h5 className="text-sm font-medium mb-3 text-gray-700">{title}</h5>

      <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${goodPercentage}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="absolute left-0 top-0 h-full bg-green-500 flex items-center justify-center"
        >
          {goodPercentage > 15 && (
            <div className="text-white text-xs font-medium">
              {goodPercentage.toFixed(0)}%
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${badPercentage}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="absolute right-0 top-0 h-full bg-red-500 flex items-center justify-center"
        >
          {badPercentage > 15 && (
            <div className="text-white text-xs font-medium">
              {badPercentage.toFixed(0)}%
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <div>Good: {data.good}</div>
        <div>Bad: {data.bad}</div>
      </div>
    </div>
  );
}