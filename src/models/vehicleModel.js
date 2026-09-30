import api from "./api";

export async function getVehicles() {
  const response = await api.get("/vehicles/");
  return response.data;
}

export async function getVehicle(id) {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
}

export async function createVehicle(data) {
  const response = await api.post("/vehicles/", data);
  return response.data;
}

export async function updateVehicle(id, data) {
  const response = await api.patch(`/vehicles/${id}`, data);
  return response.data;
}

export async function deleteVehicle(id) {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
}