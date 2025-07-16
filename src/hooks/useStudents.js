import { useState, useEffect } from "react";
import { studentService } from "@/services/api/studentService";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const addStudent = async (studentData) => {
    const newStudent = await studentService.create(studentData);
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = async (id, studentData) => {
    const updatedStudent = await studentService.update(id, studentData);
    setStudents(prev => 
      prev.map(student => student.Id === id ? updatedStudent : student)
    );
    return updatedStudent;
  };

  const deleteStudent = async (id) => {
    await studentService.delete(id);
    setStudents(prev => prev.filter(student => student.Id !== id));
  };

  return {
    students,
    loading,
    error,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent
  };
};