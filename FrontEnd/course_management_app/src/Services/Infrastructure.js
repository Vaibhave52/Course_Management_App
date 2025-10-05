import axiosInstance from "./axiosInstance";

export const getAllInfrastructures = async () => {
  try {
    const res = await axiosInstance.get("/infrastructure");
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error fetching infrastructures:", error);
  }
};

export const addInfrastructure = async (infra) => {
  try {
    const res = await axiosInstance.post("/infrastructure", infra);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error adding infrastructure:", error);
  }
};

export const updateInfrastructure = async (id, infra) => {
  try {
    const res = await axiosInstance.put(`/infrastructure/${id}`, infra);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error updating infrastructure:", error);
  }
};

export const deleteInfrastructure = async (id) => {
  try {
    const res = await axiosInstance.delete(`/infrastructure/${id}`);
    return res;
  } catch (error) {
    console.error("Error deleting infrastructure:", error);
  }
};

// ================== PREMISES ==================
export const getAllPremises = async () => {
  try {
    const res = await axiosInstance.get("/premises/getall");
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error fetching premises:", error);
  }
};
