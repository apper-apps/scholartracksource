import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { toast } from "react-toastify";

const AttendanceGrid = ({ 
  students = [], 
  attendance = [], 
  loading = false, 
  error = null,
  onRetry,
  onMarkAttendance 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    const dailyAttendance = {};
    students.forEach(student => {
      const studentAttendance = attendance.find(a => 
        a.studentId === student.Id && isSameDay(new Date(a.date), selectedDate)
      );
      dailyAttendance[student.Id] = studentAttendance ? studentAttendance.status : "present";
    });
    setAttendanceData(dailyAttendance);
  }, [selectedDate, students, attendance]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    try {
      const attendanceToSubmit = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        date: selectedDate.toISOString(),
        status,
        notes: ""
      }));

      await Promise.all(attendanceToSubmit.map(record => onMarkAttendance(record)));
      toast.success("Attendance recorded successfully!");
    } catch (error) {
      toast.error("Failed to record attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttendanceStats = () => {
    const stats = { present: 0, absent: 0, late: 0, excused: 0 };
    Object.values(attendanceData).forEach(status => {
      stats[status] = (stats[status] || 0) + 1;
    });
    return stats;
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error onRetry={onRetry} />;
  }

  if (students.length === 0) {
    return (
      <Empty
        icon="Calendar"
        title="No students found"
        message="Add students to your roster to track attendance."
        showAction={false}
      />
    );
  }

  const stats = getAttendanceStats();
  const statusColors = {
    present: "success",
    absent: "error",
    late: "warning",
    excused: "info"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Tracking</h2>
          <p className="text-gray-600">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
          <Button
            onClick={handleSubmitAttendance}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-success">{stats.present}</p>
            </div>
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-error">{stats.absent}</p>
            </div>
            <ApperIcon name="XCircle" className="w-8 h-8 text-error" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-warning">{stats.late}</p>
            </div>
            <ApperIcon name="Clock" className="w-8 h-8 text-warning" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Excused</p>
              <p className="text-2xl font-bold text-info">{stats.excused}</p>
            </div>
            <ApperIcon name="FileText" className="w-8 h-8 text-info" />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left font-medium text-gray-700">Student</th>
                <th className="px-6 py-4 text-center font-medium text-gray-700">Present</th>
                <th className="px-6 py-4 text-center font-medium text-gray-700">Late</th>
                <th className="px-6 py-4 text-center font-medium text-gray-700">Absent</th>
                <th className="px-6 py-4 text-center font-medium text-gray-700">Excused</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, index) => (
                <motion.tr
                  key={student.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-700">
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
                  {["present", "late", "absent", "excused"].map(status => (
                    <td key={status} className="px-6 py-4 text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.Id}`}
                        value={status}
                        checked={attendanceData[student.Id] === status}
                        onChange={() => handleAttendanceChange(student.Id, status)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceGrid;