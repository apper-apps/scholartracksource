import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

export const attendanceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...attendance];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return attendance.find(record => record.Id === id);
  },

  getByStudentId: async (studentId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return attendance.filter(record => record.studentId === studentId);
  },

  getByDate: async (date) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const dateString = new Date(date).toISOString().split("T")[0];
    return attendance.filter(record => 
      new Date(record.date).toISOString().split("T")[0] === dateString
    );
  },

  create: async (attendanceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const existingRecord = attendance.find(a => 
      a.studentId === attendanceData.studentId && 
      new Date(a.date).toISOString().split("T")[0] === new Date(attendanceData.date).toISOString().split("T")[0]
    );
    
    if (existingRecord) {
      return await attendanceService.update(existingRecord.Id, attendanceData);
    }
    
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(a => a.Id)) + 1
    };
    attendance.push(newRecord);
    return newRecord;
  },

  update: async (id, attendanceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = attendance.findIndex(record => record.Id === id);
    if (index !== -1) {
      attendance[index] = { ...attendance[index], ...attendanceData };
      return attendance[index];
    }
    throw new Error("Attendance record not found");
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = attendance.findIndex(record => record.Id === id);
    if (index !== -1) {
      const deletedRecord = attendance.splice(index, 1)[0];
      return deletedRecord;
    }
    throw new Error("Attendance record not found");
  }
};