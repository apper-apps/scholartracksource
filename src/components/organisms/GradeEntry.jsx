import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
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

  useEffect(() => {
    if (selectedAssignment) {
      const assignmentGrades = {};
      students.forEach(student => {
        const existingGrade = grades.find(g => 
          g.studentId === student.Id && g.assignmentId === selectedAssignment.Id
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
        studentId: parseInt(studentId),
        assignmentId: selectedAssignment.Id,
        score: parseFloat(data.score) || 0,
        comments: data.comments || "",
        submittedDate: new Date().toISOString()
      }));

      await Promise.all(gradesToSubmit.map(grade => onSubmitGrade(grade)));
      toast.success("Grades submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit grades");
    } finally {
      setIsSubmitting(false);
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
                  <span className="text-sm text-gray-600">{assignment.totalPoints} pts</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{assignment.category}</p>
                <p className="text-xs text-gray-500">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
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
                Total Points: {selectedAssignment.totalPoints}
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
                    ((parseFloat(studentGrade.score) / selectedAssignment.totalPoints) * 100).toFixed(1) : 
                    "";

                  return (
                    <tr key={student.Id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary-700">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max={selectedAssignment.totalPoints}
                          value={studentGrade.score}
                          onChange={(e) => handleGradeChange(student.Id, "score", e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-600 ml-2">
                          / {selectedAssignment.totalPoints}
                        </span>
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
                        <input
                          type="text"
                          value={studentGrade.comments}
                          onChange={(e) => handleGradeChange(student.Id, "comments", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          placeholder="Optional comments"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GradeEntry;