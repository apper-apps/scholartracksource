import { useState, useEffect } from "react";
import { assignmentService } from "@/services/api/assignmentService";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const addAssignment = async (assignmentData) => {
    const newAssignment = await assignmentService.create(assignmentData);
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = async (id, assignmentData) => {
    const updatedAssignment = await assignmentService.update(id, assignmentData);
    setAssignments(prev => 
      prev.map(assignment => assignment.Id === id ? updatedAssignment : assignment)
    );
    return updatedAssignment;
  };

  const deleteAssignment = async (id) => {
    await assignmentService.delete(id);
    setAssignments(prev => prev.filter(assignment => assignment.Id !== id));
  };

  return {
    assignments,
    loading,
    error,
    loadAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment
  };
};