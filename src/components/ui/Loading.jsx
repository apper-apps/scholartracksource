import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="p-6 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );

  if (type === "table") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <SkeletonTable />
      </motion.div>
    );
  }

  if (type === "cards") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <SkeletonStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonTable />
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;