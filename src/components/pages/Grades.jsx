import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import GradeEntry from "@/components/organisms/GradeEntry";
import { useStudents } from "@/hooks/useStudents";
import { useGrades } from "@/hooks/useGrades";
import { useAssignments } from "@/hooks/useAssignments";
import { toast } from "react-toastify";

const Grades = () => {
  const { students, loading: studentsLoading, error: studentsError, loadStudents } = useStudents();
  const { grades, loading: gradesLoading, error: gradesError, loadGrades, addGrade } = useGrades();
  const { assignments, loading: assignmentsLoading, error: assignmentsError, loadAssignments, addAssignment } = useAssignments();
  
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    category: "",
    totalPoints: "",
    dueDate: "",
    classId: "general"
  });
  const [assignmentErrors, setAssignmentErrors] = useState({});

  const loading = studentsLoading || gradesLoading || assignmentsLoading;
  const error = studentsError || gradesError || assignmentsError;

  const handleRetry = () => {
    loadStudents();
    loadGrades();
    loadAssignments();
  };

  const handleAddAssignment = () => {
    setAssignmentForm({
      title: "",
      category: "",
      totalPoints: "",
      dueDate: "",
      classId: "general"
    });
    setAssignmentErrors({});
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentFormChange = (field, value) => {
    setAssignmentForm(prev => ({ ...prev, [field]: value }));
    if (assignmentErrors[field]) {
      setAssignmentErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateAssignmentForm = () => {
    const errors = {};
    
    if (!assignmentForm.title.trim()) {
      errors.title = "Assignment title is required";
    }
    
    if (!assignmentForm.category.trim()) {
      errors.category = "Category is required";
    }
    
    if (!assignmentForm.totalPoints || assignmentForm.totalPoints <= 0) {
      errors.totalPoints = "Total points must be greater than 0";
    }
    
    if (!assignmentForm.dueDate) {
      errors.dueDate = "Due date is required";
    }
    
    setAssignmentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAssignmentForm()) {
      return;
    }

    try {
      await addAssignment({
        ...assignmentForm,
        totalPoints: parseInt(assignmentForm.totalPoints)
      });
      
      setIsAssignmentModalOpen(false);
      toast.success("Assignment created successfully!");
    } catch (error) {
      toast.error("Failed to create assignment");
    }
  };

  const handleGradeSubmit = async (gradeData) => {
    await addGrade(gradeData);
  };

  const categoryOptions = [
    "Quiz", "Test", "Homework", "Project", "Lab Report", "Essay", "Presentation", "Exam"
  ];

  useEffect(() => {
    document.title = "Grades - ScholarTrack";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">
            Manage assignments and enter student grades
          </p>
        </div>
      </div>

      <GradeEntry
        assignments={assignments}
        students={students}
        grades={grades}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onSubmitGrade={handleGradeSubmit}
        onAddAssignment={handleAddAssignment}
      />

      <Modal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        title="Create New Assignment"
        size="lg"
      >
        <form onSubmit={handleAssignmentSubmit} className="space-y-4">
          <FormField
            label="Assignment Title"
            required
            value={assignmentForm.title}
            onChange={(e) => handleAssignmentFormChange("title", e.target.value)}
            error={assignmentErrors.title}
            placeholder="Enter assignment title"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Category"
              required
              error={assignmentErrors.category}
            >
              <select
                value={assignmentForm.category}
                onChange={(e) => handleAssignmentFormChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="">Select category</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Total Points"
              type="number"
              required
              value={assignmentForm.totalPoints}
              onChange={(e) => handleAssignmentFormChange("totalPoints", e.target.value)}
              error={assignmentErrors.totalPoints}
              placeholder="100"
              min="1"
            />
          </div>

          <FormField
            label="Due Date"
            type="date"
            required
            value={assignmentForm.dueDate}
            onChange={(e) => handleAssignmentFormChange("dueDate", e.target.value)}
            error={assignmentErrors.dueDate}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAssignmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Grades;