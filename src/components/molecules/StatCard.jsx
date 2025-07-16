import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "positive",
  color = "primary",
  onClick
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-secondary-500",
    success: "from-success to-green-500",
    warning: "from-warning to-yellow-500",
    error: "from-error to-red-500",
    info: "from-info to-blue-500",
  };

  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-500",
  };

return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`p-6 hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`text-sm font-medium ${changeColors[changeType]}`}>
              {changeType === "positive" && "+"}
              {change}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;