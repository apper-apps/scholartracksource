import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;
const tableName = 'assignment';

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const assignmentService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "category" } },
          { field: { Name: "total_points" } },
          { field: { Name: "due_date" } },
          { field: { Name: "class_id" } }
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
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "category" } },
          { field: { Name: "total_points" } },
          { field: { Name: "due_date" } },
          { field: { Name: "class_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment with ID ${id}:`, error);
      return null;
    }
  },

  create: async (assignmentData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: assignmentData.Name || assignmentData.title,
          title: assignmentData.title,
          category: assignmentData.category,
          total_points: assignmentData.total_points || assignmentData.totalPoints,
          due_date: assignmentData.due_date || assignmentData.dueDate,
          class_id: assignmentData.class_id || assignmentData.classId || "general"
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
            throw new Error("Failed to create assignment");
          }
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  },

  update: async (id, assignmentData) => {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: assignmentData.Name || assignmentData.title,
          title: assignmentData.title,
          category: assignmentData.category,
          total_points: assignmentData.total_points || assignmentData.totalPoints,
          due_date: assignmentData.due_date || assignmentData.dueDate,
          class_id: assignmentData.class_id || assignmentData.classId || "general"
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
            throw new Error("Failed to update assignment");
          }
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error("No response data received");
    } catch (error) {
      console.error("Error updating assignment:", error);
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
            throw new Error("Failed to delete assignment");
          }
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting assignment:", error);
      throw error;
    }
  }
};