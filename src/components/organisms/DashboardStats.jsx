import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const DashboardStats = ({ 
  students = [], 
  grades = [], 
  attendance = [],
  assignments = [],
  onStudentsClick
}) => {
  const totalStudents = students.length;
  
  const averageGrade = grades.length > 0 ? 
    (grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length).toFixed(1) : 0;
  
  const todayAttendance = attendance.filter(a => 
    format(new Date(a.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );
  
  const presentToday = todayAttendance.filter(a => a.status === "present").length;
  const attendanceRate = totalStudents > 0 ? 
    ((presentToday / totalStudents) * 100).toFixed(1) : 0;

  const recentActivity = [
    {
      id: 1,
      type: "grade",
      message: "Math Quiz grades entered",
      time: "2 hours ago",
      icon: "BookOpen"
    },
    {
      id: 2,
      type: "attendance",
      message: "Attendance recorded for today",
      time: "3 hours ago",
      icon: "Calendar"
    },
    {
      id: 3,
      type: "student",
      message: "New student Emma Johnson enrolled",
      time: "1 day ago",
      icon: "UserPlus"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
<StatCard
            title="Total Students"
            value={totalStudents}
            icon="Users"
            color="primary"
            change="3 new this month"
            changeType="positive"
            onClick={onStudentsClick}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Average Grade"
            value={`${averageGrade}%`}
            icon="TrendingUp"
            color="success"
            change="2.5% vs last month"
            changeType="positive"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon="Calendar"
            color="info"
            change="1.2% vs yesterday"
            changeType="positive"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Active Assignments"
            value={assignments.length}
            icon="BookOpen"
            color="warning"
            change="5 due this week"
            changeType="neutral"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name={activity.icon} className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 hover:from-primary-100 hover:to-secondary-100 rounded-lg transition-colors text-left">
                <ApperIcon name="UserPlus" className="w-6 h-6 text-primary-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">Add Student</p>
              </button>
              <button className="p-4 bg-gradient-to-r from-success/10 to-green-50 hover:from-success/20 hover:to-green-100 rounded-lg transition-colors text-left">
                <ApperIcon name="Calendar" className="w-6 h-6 text-success mb-2" />
                <p className="text-sm font-medium text-gray-900">Take Attendance</p>
              </button>
              <button className="p-4 bg-gradient-to-r from-warning/10 to-orange-50 hover:from-warning/20 hover:to-orange-100 rounded-lg transition-colors text-left">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-warning mb-2" />
                <p className="text-sm font-medium text-gray-900">Enter Grades</p>
              </button>
              <button className="p-4 bg-gradient-to-r from-accent-50 to-purple-50 hover:from-accent-100 hover:to-purple-100 rounded-lg transition-colors text-left">
                <ApperIcon name="BarChart3" className="w-6 h-6 text-accent-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">View Reports</p>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;