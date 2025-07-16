import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import StudentTable from "@/components/organisms/StudentTable";
import StudentForm from "@/components/organisms/StudentForm";
import { useStudents } from "@/hooks/useStudents";
import { toast } from "react-toastify";

const Students = () => {
  const { students, loading, error, loadStudents, addStudent, updateStudent, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };
  const handleDeleteStudent = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      try {
        await deleteStudent(studentToDelete.Id);
        toast.success("Student deleted successfully");
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

const handleFormSubmit = async (formData) => {
    if (selectedStudent) {
      await updateStudent(selectedStudent.Id, formData);
    } else {
      await addStudent(formData);
    }
    setIsFormOpen(false);
    setSelectedStudent(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedStudent(null);
  };

  useEffect(() => {
    document.title = "Students - ScholarTrack";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">
            Manage your class roster and student information
          </p>
        </div>
        <Button onClick={handleAddStudent}>
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search students by name, email, or grade..."
          className="sm:w-96"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {filteredStudents.length} of {students.length} students
          </span>
        </div>
      </div>

<StudentTable
        students={filteredStudents}
        loading={loading}
        error={error}
        onRetry={loadStudents}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        size="lg"
      >
        <StudentForm
          student={selectedStudent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Student"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
Are you sure you want to delete {studentToDelete?.first_name} {studentToDelete?.last_name}? 
            This action cannot be undone and will remove all associated grades and attendance records.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Delete Student
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Students;