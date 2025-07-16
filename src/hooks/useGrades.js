import { useState, useEffect } from "react";
import { gradeService } from "@/services/api/gradeService";

export const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gradeService.getAll();
      setGrades(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  const addGrade = async (gradeData) => {
    const newGrade = await gradeService.create(gradeData);
    setGrades(prev => {
      const existingIndex = prev.findIndex(g => 
        g.studentId === gradeData.studentId && g.assignmentId === gradeData.assignmentId
      );
      if (existingIndex !== -1) {
        return prev.map((grade, index) => index === existingIndex ? newGrade : grade);
      }
      return [...prev, newGrade];
    });
    return newGrade;
  };

  const updateGrade = async (id, gradeData) => {
    const updatedGrade = await gradeService.update(id, gradeData);
    setGrades(prev => 
      prev.map(grade => grade.Id === id ? updatedGrade : grade)
    );
    return updatedGrade;
  };

  const deleteGrade = async (id) => {
    await gradeService.delete(id);
    setGrades(prev => prev.filter(grade => grade.Id !== id));
  };

  return {
    grades,
    loading,
    error,
    loadGrades,
    addGrade,
    updateGrade,
    deleteGrade
  };
};