import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import { useStudents } from "@/hooks/useStudents";
import { useAttendance } from "@/hooks/useAttendance";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";
import { toast } from "react-toastify";

const Attendance = () => {
  const { students, loading: studentsLoading, error: studentsError, loadStudents } = useStudents();
  const { 
    attendance, 
    loading: attendanceLoading, 
    error: attendanceError, 
    loadAttendance, 
    markAttendance,
    analytics,
    alerts,
    loadAnalytics 
  } = useAttendance();
  
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('30'); // days

const loading = studentsLoading || attendanceLoading;
  const error = studentsError || attendanceError;

  const handleRetry = () => {
    loadStudents();
    loadAttendance();
    if (showAnalytics) {
      loadAnalytics();
    }
  };

  const handleMarkAttendance = async (attendanceData) => {
    await markAttendance(attendanceData);
  };

useEffect(() => {
    document.title = "Attendance - ScholarTrack";
  }, []);

  useEffect(() => {
    if (showAnalytics) {
      loadAnalytics();
    }
  }, [showAnalytics, selectedDateRange]);

  const handleDismissAlert = (alertId) => {
    toast.info("Alert dismissed");
  };

  const handleContactParent = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    if (student) {
      toast.success(`Parent contact initiated for ${student.firstName} ${student.lastName}`);
    }
  };

  const getAttendanceChartData = () => {
    if (!analytics?.patterns) return { series: [], options: {} };
    
    return {
      series: [
        {
          name: 'Present',
          data: analytics.patterns.map(p => p.present)
        },
        {
          name: 'Absent',
          data: analytics.patterns.map(p => p.absent)
        },
        {
          name: 'Late',
          data: analytics.patterns.map(p => p.late)
        }
      ],
      options: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: { show: false }
        },
        colors: ['#16a34a', '#dc2626', '#f59e0b'],
        xaxis: {
          categories: analytics.patterns.map(p => p.date),
          labels: {
            style: { colors: '#6b7280' }
          }
        },
        yaxis: {
          labels: {
            style: { colors: '#6b7280' }
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        grid: {
          borderColor: '#e5e7eb'
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        }
      }
    };
  };

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Analytics Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <Button
          onClick={() => setShowAnalytics(!showAnalytics)}
          variant={showAnalytics ? "primary" : "outline"}
          className="flex items-center gap-2"
        >
          <ApperIcon name="TrendingUp" size={16} />
          {showAnalytics ? "Hide Analytics" : "Show Analytics"}
        </Button>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Average Attendance"
              value={`${analytics?.averageAttendance || 0}%`}
              icon="Users"
              color="success"
            />
            <StatCard
              title="Total Absences"
              value={analytics?.totalAbsences || 0}
              icon="UserX"
              color="error"
            />
            <StatCard
              title="Late Arrivals"
              value={analytics?.totalLate || 0}
              icon="Clock"
              color="warning"
            />
            <StatCard
              title="Active Alerts"
              value={alerts?.length || 0}
              icon="AlertTriangle"
              color="error"
            />
          </div>

          {/* Attendance Alerts */}
          {alerts && alerts.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="AlertTriangle" className="text-error" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Attendance Alerts</h3>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const student = students.find(s => s.Id === alert.studentId);
                  return (
                    <div key={alert.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex-1">
                        <p className="font-medium text-red-900">
                          {student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}
                        </p>
                        <p className="text-sm text-red-700">{alert.message}</p>
                        <p className="text-xs text-red-600 mt-1">
                          {alert.type === 'consecutive' ? 'Consecutive absences' : 'Total absences'}: {alert.count}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContactParent(alert.studentId)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Contact Parent
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismissAlert(alert.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <ApperIcon name="X" size={16} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Attendance Pattern Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Patterns</h3>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            {analytics?.patterns && (
              <Chart
                options={getAttendanceChartData().options}
                series={getAttendanceChartData().series}
                type="line"
                height={350}
              />
            )}
          </Card>
        </motion.div>
      )}

      {/* Main Attendance Grid */}
      <AttendanceGrid
        students={students}
        attendance={attendance}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onMarkAttendance={handleMarkAttendance}
      />
    </motion.div>
  );
};

export default Attendance;