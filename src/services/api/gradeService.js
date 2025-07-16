import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

export const gradeService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...grades];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return grades.find(grade => grade.Id === id);
  },

  getByStudentId: async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return grades.filter(grade => grade.studentId === studentId);
  },

  getByAssignmentId: async (assignmentId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return grades.filter(grade => grade.assignmentId === assignmentId);
  },

  create: async (gradeData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const existingGrade = grades.find(g => 
      g.studentId === gradeData.studentId && g.assignmentId === gradeData.assignmentId
    );
    
    if (existingGrade) {
      return await gradeService.update(existingGrade.Id, gradeData);
    }
    
    const newGrade = {
      ...gradeData,
      Id: Math.max(...grades.map(g => g.Id)) + 1
    };
    grades.push(newGrade);
    return newGrade;
  },

  update: async (id, gradeData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = grades.findIndex(grade => grade.Id === id);
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData };
      return grades[index];
    }
    throw new Error("Grade not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = grades.findIndex(grade => grade.Id === id);
    if (index !== -1) {
      const deletedGrade = grades.splice(index, 1)[0];
      return deletedGrade;
    }
    throw new Error("Grade not found");
  }
};