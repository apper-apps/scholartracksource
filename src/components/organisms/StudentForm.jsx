import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    grade: "",
    photo: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        dateOfBirth: student.dateOfBirth || "",
        grade: student.grade || "",
        photo: student.photo || ""
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.grade.trim()) {
      newErrors.grade = "Grade is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const studentData = {
        ...formData,
        enrollmentDate: student ? student.enrollmentDate : new Date().toISOString()
      };

      await onSubmit(studentData);
      toast.success(student ? "Student updated successfully!" : "Student added successfully!");
    } catch (error) {
      toast.error("Failed to save student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const gradeOptions = [
    "Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", 
    "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", 
    "9th Grade", "10th Grade", "11th Grade", "12th Grade"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          required
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          error={errors.firstName}
          placeholder="Enter first name"
        />
        
        <FormField
          label="Last Name"
          required
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          error={errors.lastName}
          placeholder="Enter last name"
        />
      </div>

      <FormField
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        placeholder="Enter email address"
      />

      <FormField
        label="Phone"
        type="tel"
        required
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        error={errors.phone}
        placeholder="Enter phone number"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Date of Birth"
          type="date"
          required
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          error={errors.dateOfBirth}
        />

        <FormField
          label="Grade"
          required
          error={errors.grade}
        >
          <select
            value={formData.grade}
            onChange={(e) => handleChange("grade", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">Select grade</option>
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : (student ? "Update Student" : "Add Student")}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;