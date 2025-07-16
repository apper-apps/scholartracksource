import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

export const studentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...students];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return students.find(student => student.Id === id);
  },

  create: async (studentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id)) + 1
    };
    students.push(newStudent);
    return newStudent;
  },

  update: async (id, studentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = students.findIndex(student => student.Id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
      return students[index];
    }
    throw new Error("Student not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = students.findIndex(student => student.Id === id);
    if (index !== -1) {
      const deletedStudent = students.splice(index, 1)[0];
      return deletedStudent;
    }
    throw new Error("Student not found");
  }
};