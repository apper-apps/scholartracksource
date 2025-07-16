import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  actionText = "Add Item",
  onAction,
  icon = "Package",
  showAction = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
    >
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full blur-xl"></div>
        <div className="relative bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 p-6 rounded-full">
          <ApperIcon name={icon} className="w-12 h-12 text-primary-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {showAction && onAction && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;