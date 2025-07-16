import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading your data. Please try again.", 
  onRetry,
  showIcon = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      {showIcon && (
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-error/20 to-warning/20 rounded-full blur-xl"></div>
          <div className="relative bg-gradient-to-r from-error to-warning p-4 rounded-full">
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-white" />
          </div>
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RefreshCw" className="w-5 h-5 mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;