import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useStudents } from "@/hooks/useStudents";
import { useGrades } from "@/hooks/useGrades";
import { useAttendance } from "@/hooks/useAttendance";
import { useAssignments } from "@/hooks/useAssignments";

const Dashboard = () => {
  const navigate = useNavigate();
  const { students, loading: studentsLoading, error: studentsError, loadStudents } = useStudents();
  const { grades, loading: gradesLoading, error: gradesError, loadGrades } = useGrades();
  const { attendance, loading: attendanceLoading, error: attendanceError, loadAttendance } = useAttendance();
  const { assignments, loading: assignmentsLoading, error: assignmentsError, loadAssignments } = useAssignments();

  const loading = studentsLoading || gradesLoading || attendanceLoading || assignmentsLoading;
  const error = studentsError || gradesError || attendanceError || assignmentsError;

  const handleRetry = () => {
    loadStudents();
    loadGrades();
    loadAttendance();
    loadAssignments();
  };

  useEffect(() => {
    document.title = "Dashboard - ScholarTrack";
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={handleRetry} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here"s what"s happening in your classroom today.
          </p>
        </div>
      </div>

      <DashboardStats
        students={students}
        grades={grades}
        attendance={attendance}
        assignments={assignments}
      />
    </motion.div>
  );
};

export default Dashboard;