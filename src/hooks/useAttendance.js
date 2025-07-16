import { useState, useEffect } from "react";
import { attendanceService } from "@/services/api/attendanceService";

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.getAll();
      setAttendance(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
};

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsData, alertsData] = await Promise.all([
        attendanceService.getAttendanceAnalytics(),
        attendanceService.getAttendanceAlerts()
      ]);
      setAnalytics(analyticsData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const markAttendance = async (attendanceData) => {
    const newRecord = await attendanceService.create(attendanceData);
    setAttendance(prev => {
      const existingIndex = prev.findIndex(a => 
        a.studentId === attendanceData.studentId && 
        new Date(a.date).toISOString().split("T")[0] === new Date(attendanceData.date).toISOString().split("T")[0]
      );
      if (existingIndex !== -1) {
        return prev.map((record, index) => index === existingIndex ? newRecord : record);
      }
      return [...prev, newRecord];
    });
    return newRecord;
  };

  const updateAttendance = async (id, attendanceData) => {
    const updatedRecord = await attendanceService.update(id, attendanceData);
    setAttendance(prev => 
      prev.map(record => record.Id === id ? updatedRecord : record)
    );
    return updatedRecord;
  };

  const deleteAttendance = async (id) => {
    await attendanceService.delete(id);
    setAttendance(prev => prev.filter(record => record.Id !== id));
  };

return {
    attendance,
    analytics,
    alerts,
    loading,
    error,
    loadAttendance,
    loadAnalytics,
    markAttendance,
    updateAttendance,
    deleteAttendance
  };
};