import { motion } from "framer-motion";

interface ComparisonButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

export default function ComparisonButton({
  isActive,
  onClick,
  label,
}: ComparisonButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </motion.button>
  );
}