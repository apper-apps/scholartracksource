import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const GradeEntry = ({ 
  assignments = [], 
  students = [], 
  grades = [], 
  loading = false, 
  error = null,
  onRetry,
  onSubmitGrade,
  onAddAssignment 
}) => {
const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradeData, setGradeData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    score: "",
    comments: ""
  });
  const [gradeErrors, setGradeErrors] = useState({});
  const [isUpdatingGrade, setIsUpdatingGrade] = useState(false);

  useEffect(() => {
    if (selectedAssignment) {
      const assignmentGrades = {};
      students.forEach(student => {
const existingGrade = grades.find(g => 
          g.student_id?.Id === student.Id && g.assignment_id?.Id === selectedAssignment.Id
        );
        assignmentGrades[student.Id] = {
          score: existingGrade ? existingGrade.score : "",
          comments: existingGrade ? existingGrade.comments : ""
        };
      });
      setGradeData(assignmentGrades);
    }
  }, [selectedAssignment, students, grades]);

  const handleGradeChange = (studentId, field, value) => {
    setGradeData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSubmitGrades = async () => {
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    try {
const gradesToSubmit = Object.entries(gradeData).map(([studentId, data]) => ({
        student_id: parseInt(studentId),
        assignment_id: selectedAssignment.Id,
        score: parseFloat(data.score) || 0,
        comments: data.comments || "",
        submitted_date: new Date().toISOString().split('T')[0]
      }));

      await Promise.all(gradesToSubmit.map(grade => onSubmitGrade(grade)));
      toast.success("Grades submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit grades");
    } finally {
      setIsSubmitting(false);
    }
};

  const handleGradeClick = (student, grade) => {
    setSelectedGrade({ student, grade });
    setGradeForm({
      score: grade?.score?.toString() || "",
      comments: grade?.comments || ""
    });
    setGradeErrors({});
    setIsGradeModalOpen(true);
  };

  const handleGradeFormChange = (field, value) => {
    setGradeForm(prev => ({ ...prev, [field]: value }));
    if (gradeErrors[field]) {
      setGradeErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateGradeForm = () => {
    const errors = {};
    const score = parseFloat(gradeForm.score);
    
if (gradeForm.score && (isNaN(score) || score < 0 || score > selectedAssignment.total_points)) {
      errors.score = `Score must be between 0 and ${selectedAssignment.total_points}`;
    }
    
    setGradeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGradeUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateGradeForm()) {
      return;
    }

    setIsUpdatingGrade(true);
    try {
const updatedGradeData = {
        student_id: selectedGrade.student.Id,
        assignment_id: selectedAssignment.Id,
        score: parseFloat(gradeForm.score) || 0,
        comments: gradeForm.comments || "",
        submitted_date: new Date().toISOString().split('T')[0]
      };

      await onSubmitGrade(updatedGradeData);
      
      setIsGradeModalOpen(false);
      toast.success("Grade updated successfully!");
    } catch (error) {
      toast.error("Failed to update grade");
    } finally {
      setIsUpdatingGrade(false);
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error onRetry={onRetry} />;
  }

  if (assignments.length === 0) {
    return (
      <Empty
        icon="BookOpen"
        title="No assignments found"
        message="Create your first assignment to start grading students."
        actionText="Add Assignment"
        onAction={onAddAssignment}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Assignment</h3>
          <Button onClick={onAddAssignment} size="sm">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Assignment
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment.Id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedAssignment?.Id === assignment.Id
                    ? "ring-2 ring-primary-500 bg-primary-50"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedAssignment(assignment)}
              >
<div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                  <span className="text-sm text-gray-600">{assignment.total_points} pts</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{assignment.category}</p>
<p className="text-xs text-gray-500">
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {selectedAssignment && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Grade Entry: {selectedAssignment.title}
              </h3>
<p className="text-sm text-gray-600">
                Total Points: {selectedAssignment.total_points}
              </p>
            </div>
            <Button
              onClick={handleSubmitGrades}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Grades"}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Percentage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => {
                  const studentGrade = gradeData[student.Id] || { score: "", comments: "" };
const percentage = studentGrade.score ? 
                    ((parseFloat(studentGrade.score) / selectedAssignment.total_points) * 100).toFixed(1) : 
                    "";

                  return (
                    <tr key={student.Id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
<span className="text-xs font-semibold text-primary-700">
                            {student.first_name[0]}{student.last_name[0]}
                          </span>
                          </div>
<span className="font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </span>
                        </div>
                      </td>
<td className="py-3 px-4">
                        <div 
                          className="flex items-center cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors"
onClick={() => handleGradeClick(student, grades.find(g => g.student_id?.Id === student.Id && g.assignment_id?.Id === selectedAssignment.Id))}
                        >
                          <span className="text-sm font-medium text-primary-600">
                            {studentGrade.score || "0"} / {selectedAssignment.total_points}
                          </span>
                          <ApperIcon name="ExternalLink" className="w-3 h-3 ml-2 text-gray-400" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${
                          percentage >= 90 ? "text-success" :
                          percentage >= 80 ? "text-warning" :
                          percentage >= 70 ? "text-warning" :
                          percentage ? "text-error" : "text-gray-500"
                        }`}>
                          {percentage ? `${percentage}%` : "-"}
                        </span>
                      </td>
<td className="py-3 px-4">
                        <div 
                          className="cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors"
onClick={() => handleGradeClick(student, grades.find(g => g.student_id?.Id === student.Id && g.assignment_id?.Id === selectedAssignment.Id))}
                        >
                          <span className="text-sm text-gray-600 truncate max-w-xs block">
                            {studentGrade.comments || "Click to add comments"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
)}

      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
title={selectedGrade ? `Grade Details - ${selectedGrade.student.first_name} ${selectedGrade.student.last_name}` : "Grade Details"}
        size="md"
      >
        {selectedGrade && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Assignment Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Assignment:</span>
                  <p className="font-medium">{selectedAssignment.title}</p>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <p className="font-medium">{selectedAssignment.category}</p>
                </div>
                <div>
<span className="text-gray-600">Total Points:</span>
                  <p className="font-medium">{selectedAssignment.total_points}</p>
                </div>
                <div>
                  <span className="text-gray-600">Due Date:</span>
<p className="font-medium">{new Date(selectedAssignment.due_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
<span className="text-sm font-semibold text-primary-700">
                    {selectedGrade.student.first_name[0]}{selectedGrade.student.last_name[0]}
                  </span>
                </div>
                <div>
<p className="font-medium text-gray-900">
                    {selectedGrade.student.first_name} {selectedGrade.student.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{selectedGrade.student.email}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleGradeUpdate} className="space-y-4">
              <FormField
                label="Score"
                type="number"
                value={gradeForm.score}
                onChange={(e) => handleGradeFormChange("score", e.target.value)}
                error={gradeErrors.score}
                placeholder="Enter score"
                min="0"
max={selectedAssignment.total_points}
              >
                <div className="mt-1 text-sm text-gray-600">
Out of {selectedAssignment.total_points} points
                  {gradeForm.score && (
                    <span className="ml-2 font-medium">
({((parseFloat(gradeForm.score) / selectedAssignment.total_points) * 100).toFixed(1)}%)
                    </span>
                  )}
                </div>
              </FormField>

              <FormField
                label="Comments"
                value={gradeForm.comments}
                onChange={(e) => handleGradeFormChange("comments", e.target.value)}
                placeholder="Optional feedback for the student"
                as="textarea"
                rows={3}
              />

              {selectedGrade.grade && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Last Updated:</p>
<p className="text-sm font-medium">
                    {new Date(selectedGrade.grade.submitted_date).toLocaleDateString()} at {new Date(selectedGrade.grade.submitted_date).toLocaleTimeString()}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsGradeModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingGrade}>
                  {isUpdatingGrade ? "Updating..." : "Update Grade"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GradeEntry;