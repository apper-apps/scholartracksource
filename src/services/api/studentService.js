import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;
const tableName = 'student';

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const studentService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "date_of_birth" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "grade" } },
          { field: { Name: "photo" } }
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
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "first_name" } },
          { field: { Name: "last_name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "date_of_birth" } },
          { field: { Name: "enrollment_date" } },
          { field: { Name: "grade" } },
          { field: { Name: "photo" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with ID ${id}:`, error);
      return null;
    }
  },

  create: async (studentData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: studentData.Name || `${studentData.first_name} ${studentData.last_name}`,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          email: studentData.email,
          phone: studentData.phone,
          date_of_birth: studentData.date_of_birth,
          enrollment_date: studentData.enrollment_date,
          grade: studentData.grade,
          photo: studentData.photo || ""
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
            throw new Error("Failed to create student");
          }
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  update: async (id, studentData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: studentData.Name || `${studentData.first_name} ${studentData.last_name}`,
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          email: studentData.email,
          phone: studentData.phone,
          date_of_birth: studentData.date_of_birth,
          enrollment_date: studentData.enrollment_date,
          grade: studentData.grade,
          photo: studentData.photo || ""
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
            throw new Error("Failed to update student");
          }
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating student:", error);
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
            throw new Error("Failed to delete student");
          }
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  }
};