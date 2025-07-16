import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useStudents } from "@/hooks/useStudents";
import { useGrades } from "@/hooks/useGrades";
import { useAttendance } from "@/hooks/useAttendance";
import { useAssignments } from "@/hooks/useAssignments";
import { format } from "date-fns";
import Chart from "react-apexcharts";
import { chartService } from "@/services/api/chartService";

const Reports = () => {
  const { students, loading: studentsLoading, error: studentsError, loadStudents } = useStudents();
  const { grades, loading: gradesLoading, error: gradesError, loadGrades } = useGrades();
  const { attendance, loading: attendanceLoading, error: attendanceError, loadAttendance } = useAttendance();
  const { assignments, loading: assignmentsLoading, error: assignmentsError, loadAssignments } = useAssignments();

  const [selectedReport, setSelectedReport] = useState("overview");

  const loading = studentsLoading || gradesLoading || attendanceLoading || assignmentsLoading;
  const error = studentsError || gradesError || attendanceError || assignmentsError;

  const handleRetry = () => {
    loadStudents();
    loadGrades();
    loadAttendance();
    loadAssignments();
  };

  const calculateStudentGradeAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;
    
    const totalPoints = studentGrades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + (assignment ? assignment.totalPoints : 0);
    }, 0);
    
    const earnedPoints = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
    
    return totalPoints > 0 ? ((earnedPoints / totalPoints) * 100).toFixed(1) : 0;
  };

  const calculateStudentAttendanceRate = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    if (studentAttendance.length === 0) return 0;
    
    const presentCount = studentAttendance.filter(a => a.status === "present").length;
    return ((presentCount / studentAttendance.length) * 100).toFixed(1);
  };

  const getGradeColor = (average) => {
    if (average >= 90) return "success";
    if (average >= 80) return "info";
    if (average >= 70) return "warning";
    return "error";
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return "success";
    if (rate >= 85) return "info";
    if (rate >= 75) return "warning";
    return "error";
  };

const reportTypes = [
    { id: "overview", label: "Class Overview", icon: "BarChart3" },
    { id: "grades", label: "Grade Report", icon: "BookOpen" },
    { id: "attendance", label: "Attendance Report", icon: "Calendar" },
    { id: "performance", label: "Performance Analysis", icon: "TrendingUp" },
    { id: "trends", label: "Trend Charts", icon: "LineChart" }
  ];

  useEffect(() => {
    document.title = "Reports - ScholarTrack";
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={handleRetry} />;
  }

  const renderOverviewReport = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Statistics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Students</span>
            <span className="font-semibold text-gray-900">{students.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Assignments</span>
            <span className="font-semibold text-gray-900">{assignments.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average Class Grade</span>
            <span className="font-semibold text-gray-900">
              {grades.length > 0 ? 
                (grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average Attendance</span>
            <span className="font-semibold text-gray-900">
              {attendance.length > 0 ? 
                ((attendance.filter(a => a.status === "present").length / attendance.length) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <ApperIcon name="BookOpen" className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-gray-600">
              {grades.length} grades entered this week
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Calendar" className="w-5 h-5 text-success" />
            <span className="text-sm text-gray-600">
              Attendance recorded for {new Set(attendance.map(a => a.date)).size} days
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Users" className="w-5 h-5 text-info" />
            <span className="text-sm text-gray-600">
              {students.length} active students
            </span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderGradeReport = () => (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Individual Grade Report</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left font-medium text-gray-700">Student</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Grade</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Average</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Assignments</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => {
              const average = calculateStudentGradeAverage(student.Id);
              const studentGrades = grades.filter(g => g.studentId === student.Id);
              
              return (
                <tr key={student.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-700">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{student.grade}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getGradeColor(average)}>{student.grade}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      average >= 90 ? "text-success" :
                      average >= 80 ? "text-info" :
                      average >= 70 ? "text-warning" : "text-error"
                    }`}>
                      {average}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{studentGrades.length}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getGradeColor(average)}>
                      {average >= 90 ? "Excellent" :
                       average >= 80 ? "Good" :
                       average >= 70 ? "Satisfactory" : "Needs Improvement"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderAttendanceReport = () => (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Report</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left font-medium text-gray-700">Student</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Present</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Absent</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Late</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Rate</th>
              <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => {
              const studentAttendance = attendance.filter(a => a.studentId === student.Id);
              const presentCount = studentAttendance.filter(a => a.status === "present").length;
              const absentCount = studentAttendance.filter(a => a.status === "absent").length;
              const lateCount = studentAttendance.filter(a => a.status === "late").length;
              const rate = calculateStudentAttendanceRate(student.Id);
              
              return (
                <tr key={student.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-700">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{student.grade}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-success font-medium">{presentCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-error font-medium">{absentCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-warning font-medium">{lateCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      rate >= 95 ? "text-success" :
                      rate >= 85 ? "text-info" :
                      rate >= 75 ? "text-warning" : "text-error"
                    }`}>
                      {rate}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getAttendanceColor(rate)}>
                      {rate >= 95 ? "Excellent" :
                       rate >= 85 ? "Good" :
                       rate >= 75 ? "Fair" : "Poor"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderPerformanceReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h4>
          <div className="space-y-3">
            {students
              .map(student => ({
                ...student,
                average: calculateStudentGradeAverage(student.Id)
              }))
              .sort((a, b) => b.average - a.average)
              .slice(0, 3)
              .map((student, index) => (
                <div key={student.Id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <span className="text-sm text-gray-900">
                      {student.firstName} {student.lastName}
                    </span>
                  </div>
                  <Badge variant="success">{student.average}%</Badge>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Perfect Attendance</h4>
          <div className="space-y-3">
            {students
              .filter(student => calculateStudentAttendanceRate(student.Id) >= 95)
              .slice(0, 3)
              .map((student) => (
                <div key={student.Id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">
                    {student.firstName} {student.lastName}
                  </span>
                  <Badge variant="success">{calculateStudentAttendanceRate(student.Id)}%</Badge>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Needs Attention</h4>
          <div className="space-y-3">
            {students
              .filter(student => 
                calculateStudentGradeAverage(student.Id) < 70 || 
                calculateStudentAttendanceRate(student.Id) < 80
              )
              .slice(0, 3)
              .map((student) => (
                <div key={student.Id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">
                    {student.firstName} {student.lastName}
                  </span>
                  <Badge variant="warning">Review</Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
);

  const renderTrendCharts = () => {
    const trendData = chartService.calculateTrendData(students, grades, assignments);
    const overallTrend = chartService.calculateOverallTrend(grades, assignments);
    
    return (
      <div className="space-y-6">
        {/* Overall Performance Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Overall Class Performance</h3>
            <Badge variant="info">Average Trend</Badge>
          </div>
          <div className="h-80">
            <Chart
              options={{
                chart: {
                  type: 'line',
                  height: 320,
                  toolbar: { show: false },
                  zoom: { enabled: false }
                },
                colors: ['#3b82f6', '#16a34a', '#f59e0b'],
                stroke: {
                  curve: 'smooth',
                  width: 3
                },
                xaxis: {
                  categories: overallTrend.categories,
                  labels: {
                    style: { fontSize: '12px', colors: '#6b7280' }
                  }
                },
                yaxis: {
                  min: 0,
                  max: 100,
                  labels: {
                    style: { fontSize: '12px', colors: '#6b7280' }
                  }
                },
                tooltip: {
                  y: {
                    formatter: (val) => `${val}%`
                  }
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'right'
                },
                grid: {
                  borderColor: '#e5e7eb',
                  strokeDashArray: 4
                }
              }}
              series={[
                {
                  name: 'Assignments',
                  data: overallTrend.assignments
                },
                {
                  name: 'Tests',
                  data: overallTrend.tests
                },
                {
                  name: 'Overall Grade',
                  data: overallTrend.overall
                }
              ]}
              type="line"
              height={320}
            />
          </div>
        </Card>

        {/* Individual Student Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Individual Student Trends</h3>
            <Badge variant="secondary">{students.length} Students</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {students.slice(0, 4).map((student) => {
              const studentTrend = chartService.calculateStudentTrend(student.Id, grades, assignments);
              
              return (
                <Card key={student.Id} className="p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary-700">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{student.grade}</p>
                      </div>
                    </div>
                    <Badge variant={studentTrend.trend === 'up' ? 'success' : studentTrend.trend === 'down' ? 'error' : 'info'}>
                      {studentTrend.average.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="h-48">
                    <Chart
                      options={{
                        chart: {
                          type: 'line',
                          height: 192,
                          toolbar: { show: false },
                          zoom: { enabled: false }
                        },
                        colors: ['#3b82f6'],
                        stroke: {
                          curve: 'smooth',
                          width: 2
                        },
                        xaxis: {
                          categories: studentTrend.categories,
                          labels: {
                            style: { fontSize: '10px', colors: '#6b7280' }
                          }
                        },
                        yaxis: {
                          min: 0,
                          max: 100,
                          labels: {
                            style: { fontSize: '10px', colors: '#6b7280' }
                          }
                        },
                        tooltip: {
                          y: {
                            formatter: (val) => `${val}%`
                          }
                        },
                        legend: { show: false },
                        grid: {
                          borderColor: '#f3f4f6',
                          strokeDashArray: 2
                        }
                      }}
                      series={[
                        {
                          name: 'Performance',
                          data: studentTrend.scores
                        }
                      ]}
                      type="line"
                      height={192}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        {/* Assignment Category Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance by Assignment Type</h3>
            <Badge variant="accent">Category Analysis</Badge>
          </div>
          <div className="h-80">
            <Chart
              options={{
                chart: {
                  type: 'line',
                  height: 320,
                  toolbar: { show: false }
                },
                colors: ['#3b82f6', '#16a34a', '#f59e0b', '#9333ea', '#dc2626'],
                stroke: {
                  curve: 'smooth',
                  width: 2
                },
                xaxis: {
                  categories: chartService.getCategoryTrendLabels(assignments),
                  labels: {
                    style: { fontSize: '12px', colors: '#6b7280' }
                  }
                },
                yaxis: {
                  min: 0,
                  max: 100,
                  labels: {
                    style: { fontSize: '12px', colors: '#6b7280' }
                  }
                },
                tooltip: {
                  y: {
                    formatter: (val) => `${val}%`
                  }
                },
                legend: {
                  position: 'top',
                  horizontalAlign: 'right'
                },
                grid: {
                  borderColor: '#e5e7eb',
                  strokeDashArray: 4
                }
              }}
              series={chartService.calculateCategoryTrends(grades, assignments)}
              type="line"
              height={320}
            />
          </div>
        </Card>
      </div>
    );
  };

  const renderReport = () => {
    switch (selectedReport) {
      case "overview":
        return renderOverviewReport();
      case "grades":
        return renderGradeReport();
      case "attendance":
        return renderAttendanceReport();
      case "performance":
        return renderPerformanceReport();
      case "trends":
        return renderTrendCharts();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            View comprehensive reports and analytics
          </p>
        </div>
        <Button>
          <ApperIcon name="Download" className="w-5 h-5 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {reportTypes.map((report) => (
          <Button
            key={report.id}
            variant={selectedReport === report.id ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedReport(report.id)}
          >
            <ApperIcon name={report.icon} className="w-4 h-4 mr-2" />
            {report.label}
          </Button>
        ))}
      </div>

      {renderReport()}
    </motion.div>
  );
};

export default Reports;