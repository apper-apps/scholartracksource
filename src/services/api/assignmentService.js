import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

export const assignmentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...assignments];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return assignments.find(assignment => assignment.Id === id);
  },

  create: async (assignmentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...assignments.map(a => a.Id)) + 1
    };
    assignments.push(newAssignment);
    return newAssignment;
  },

  update: async (id, assignmentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = assignments.findIndex(assignment => assignment.Id === id);
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...assignmentData };
      return assignments[index];
    }
    throw new Error("Assignment not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignments.findIndex(assignment => assignment.Id === id);
    if (index !== -1) {
      const deletedAssignment = assignments.splice(index, 1)[0];
      return deletedAssignment;
    }
    throw new Error("Assignment not found");
  }
};