import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { format } from "date-fns";

const StudentTable = ({ 
  students = [], 
  loading = false, 
  error = null, 
  onRetry,
  onEdit,
  onDelete,
  onView 
}) => {
  const [sortBy, setSortBy] = useState("lastName");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error onRetry={onRetry} />;
  }

  if (students.length === 0) {
    return (
      <Empty
        icon="Users"
        title="No students found"
        message="Start building your class roster by adding your first student."
        actionText="Add Student"
        onAction={() => onEdit(null)}
      />
    );
  }

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-primary-600 transition-colors"
    >
      <span>{children}</span>
      {sortBy === field && (
        <ApperIcon 
          name={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4" 
        />
      )}
    </button>
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left">
                <SortButton field="lastName">Student</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="grade">Grade</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="email">Contact</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="enrollmentDate">Enrolled</SortButton>
              </th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedStudents.map((student, index) => (
              <motion.tr
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-700">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        ID: {student.Id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="primary">{student.grade}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">{student.email}</p>
                    <p className="text-sm text-gray-600">{student.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">
                    {format(new Date(student.enrollmentDate), "MMM d, yyyy")}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="success">Active</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(student)}
                      className="p-2"
                    >
                      <ApperIcon name="Eye" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student)}
                      className="p-2"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(student.Id)}
                      className="p-2 text-error hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StudentTable;