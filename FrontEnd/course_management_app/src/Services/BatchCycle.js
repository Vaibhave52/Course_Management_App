import axiosInstance from "./axiosInstance";

// Fetch all batch cycles
export const getAllBatchCycles = () => axiosInstance.get("/batchcycle/getall");

// Add new batch cycle
export const addBatchCycle = (data) =>
  axiosInstance.post("/batchcycle/add", data);

// Update existing batch cycle
export const updateBatchCycle = (id, data) =>
  axiosInstance.put(`/batchcycle/edit/${id}`, data);

// Delete a batch cycle
export const deleteBatchCycle = (id) =>
  axiosInstance.delete(`/batchcycle/delete/${id}`);
