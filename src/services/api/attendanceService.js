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
return deletedRecord;
    }
    throw new Error("Attendance record not found");
  },

  getAttendanceAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const recentAttendance = attendance.filter(record => 
      new Date(record.date) >= thirtyDaysAgo
    );
    
    const patterns = [];
    const dateGroups = {};
    
    recentAttendance.forEach(record => {
      const dateKey = record.date;
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = { present: 0, absent: 0, late: 0, excused: 0 };
      }
      dateGroups[dateKey][record.status]++;
    });
    
    Object.keys(dateGroups).sort().forEach(date => {
      patterns.push({ date, ...dateGroups[date] });
    });
    
    const totalRecords = recentAttendance.length;
    const presentCount = recentAttendance.filter(r => r.status === 'present').length;
    const absentCount = recentAttendance.filter(r => r.status === 'absent').length;
    const lateCount = recentAttendance.filter(r => r.status === 'late').length;
    
    return {
      patterns,
      averageAttendance: totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0,
      totalAbsences: absentCount,
      totalLate: lateCount,
      totalRecords
    };
  },

  getAttendanceAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const alerts = [];
    const studentAttendance = {};
    
    // Group attendance by student
    attendance.forEach(record => {
      if (!studentAttendance[record.studentId]) {
        studentAttendance[record.studentId] = [];
      }
      studentAttendance[record.studentId].push(record);
    });
    
    // Check each student for excessive absences
    Object.keys(studentAttendance).forEach(studentId => {
      const records = studentAttendance[studentId].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
      
      const totalAbsences = records.filter(r => r.status === 'absent').length;
      const consecutiveAbsences = calculateConsecutiveAbsences(records);
      
      // Alert for 3+ consecutive absences
      if (consecutiveAbsences >= 3) {
        alerts.push({
          id: `consecutive-${studentId}`,
          studentId: parseInt(studentId),
          type: 'consecutive',
          count: consecutiveAbsences,
          message: `${consecutiveAbsences} consecutive absences - immediate attention required`,
          severity: 'high',
          date: new Date().toISOString()
        });
      }
      
      // Alert for 5+ total absences in last 30 days
      if (totalAbsences >= 5) {
        alerts.push({
          id: `total-${studentId}`,
          studentId: parseInt(studentId),
          type: 'total',
          count: totalAbsences,
          message: `${totalAbsences} total absences - consider intervention`,
          severity: 'medium',
          date: new Date().toISOString()
        });
      }
    });
    
    return alerts;
  }
};

function calculateConsecutiveAbsences(records) {
  let maxConsecutive = 0;
  let currentConsecutive = 0;
  
  records.forEach(record => {
    if (record.status === 'absent') {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 0;
    }
  });
  
  return maxConsecutive;
}