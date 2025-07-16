import { useEffect } from "react";
import { motion } from "framer-motion";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import { useStudents } from "@/hooks/useStudents";
import { useAttendance } from "@/hooks/useAttendance";

const Attendance = () => {
  const { students, loading: studentsLoading, error: studentsError, loadStudents } = useStudents();
  const { attendance, loading: attendanceLoading, error: attendanceError, loadAttendance, markAttendance } = useAttendance();

  const loading = studentsLoading || attendanceLoading;
  const error = studentsError || attendanceError;

  const handleRetry = () => {
    loadStudents();
    loadAttendance();
  };

  const handleMarkAttendance = async (attendanceData) => {
    await markAttendance(attendanceData);
  };

  useEffect(() => {
    document.title = "Attendance - ScholarTrack";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
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