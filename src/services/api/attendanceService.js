import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;
const tableName = 'attendance';

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const attendanceService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance records");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance record with ID ${id}:`, error);
      return null;
    }
  },

  getByStudentId: async (studentId) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "student_id",
            Operator: "EqualTo",
            Values: [studentId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by student ID:", error);
      return [];
    }
  },

  getByDate: async (date) => {
    try {
      const apperClient = getApperClient();
      const dateString = new Date(date).toISOString().split("T")[0];
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [dateString]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error);
      return [];
    }
  },

  create: async (attendanceData) => {
    try {
      const apperClient = getApperClient();
      
      // First check if record already exists for this student on this date
      const existingRecords = await attendanceService.getByDate(attendanceData.date);
      const existingRecord = existingRecords.find(record => 
        record.student_id?.Id === attendanceData.student_id || record.student_id?.Id === attendanceData.studentId
      );
      
      if (existingRecord) {
        return await attendanceService.update(existingRecord.Id, attendanceData);
      }
      
      const params = {
        records: [{
          Name: attendanceData.Name || `Attendance for ${attendanceData.date}`,
          date: attendanceData.date,
          status: attendanceData.status || "present",
          notes: attendanceData.notes || "",
          student_id: attendanceData.student_id || attendanceData.studentId
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulRecords.length === 0) {
            throw new Error("Failed to create attendance record");
          }
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating attendance record:", error);
      throw error;
    }
  },

  update: async (id, attendanceData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: attendanceData.Name || `Attendance for ${attendanceData.date}`,
          date: attendanceData.date,
          status: attendanceData.status || "present",
          notes: attendanceData.notes || "",
          student_id: attendanceData.student_id || attendanceData.studentId
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          
          if (successfulRecords.length === 0) {
            throw new Error("Failed to update attendance record");
          }
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating attendance record:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          
          if (successfulDeletions.length === 0) {
            throw new Error("Failed to delete attendance record");
          }
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      throw error;
    }
  },

  getAttendanceAnalytics: async () => {
    try {
      const allAttendance = await attendanceService.getAll();
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      const recentAttendance = allAttendance.filter(record => 
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
    } catch (error) {
      console.error("Error fetching attendance analytics:", error);
      return {
        patterns: [],
        averageAttendance: 0,
        totalAbsences: 0,
        totalLate: 0,
        totalRecords: 0
      };
    }
  },

  getAttendanceAlerts: async () => {
    try {
      const allAttendance = await attendanceService.getAll();
      
      const alerts = [];
      const studentAttendance = {};
      
      // Group attendance by student
      allAttendance.forEach(record => {
        const studentId = record.student_id?.Id || record.student_id;
        if (!studentAttendance[studentId]) {
          studentAttendance[studentId] = [];
        }
        studentAttendance[studentId].push(record);
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
    } catch (error) {
      console.error("Error fetching attendance alerts:", error);
      return [];
    }
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