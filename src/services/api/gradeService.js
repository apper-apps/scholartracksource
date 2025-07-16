import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;
const tableName = 'grade';

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const gradeService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
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
      console.error("Error fetching grades:", error);
      toast.error("Failed to load grades");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
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
      console.error(`Error fetching grade with ID ${id}:`, error);
      return null;
    }
  },

  getByStudentId: async (studentId) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
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
      console.error("Error fetching grades by student ID:", error);
      return [];
    }
  },

  getByAssignmentId: async (assignmentId) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score" } },
          { field: { Name: "submitted_date" } },
          { field: { Name: "comments" } },
          { 
            field: { Name: "student_id" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "assignment_id" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "assignment_id",
            Operator: "EqualTo",
            Values: [assignmentId]
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
      console.error("Error fetching grades by assignment ID:", error);
      return [];
    }
  },

  create: async (gradeData) => {
    try {
      const apperClient = getApperClient();
      
      // First check if grade already exists
      const existingGrades = await gradeService.getAll();
      const existingGrade = existingGrades.find(g => 
        g.student_id?.Id === gradeData.student_id && g.assignment_id?.Id === gradeData.assignment_id
      );
      
      if (existingGrade) {
        return await gradeService.update(existingGrade.Id, gradeData);
      }
      
      const params = {
        records: [{
          Name: gradeData.Name || `Grade for Student ${gradeData.student_id}`,
          score: gradeData.score,
          submitted_date: gradeData.submitted_date || gradeData.submittedDate,
          comments: gradeData.comments || "",
          student_id: gradeData.student_id || gradeData.studentId,
          assignment_id: gradeData.assignment_id || gradeData.assignmentId
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
            throw new Error("Failed to create grade");
          }
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating grade:", error);
      throw error;
    }
  },

  update: async (id, gradeData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: gradeData.Name || `Grade for Student ${gradeData.student_id}`,
          score: gradeData.score,
          submitted_date: gradeData.submitted_date || gradeData.submittedDate,
          comments: gradeData.comments || "",
          student_id: gradeData.student_id || gradeData.studentId,
          assignment_id: gradeData.assignment_id || gradeData.assignmentId
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
            throw new Error("Failed to update grade");
          }
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating grade:", error);
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
            throw new Error("Failed to delete grade");
          }
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting grade:", error);
      throw error;
    }
  }
};