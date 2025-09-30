import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const updateProfile = async (
  token: string,
  data: { name?: string; email?: string; theme?: string }
) => {
  const res = await axios.put(`${API_URL}/auth/update-profile`, data, {
    headers: getAuthHeaders(token),
  });
  return res.data.user;
};

export const updatePassword = async (token: string, password: string) => {
  const res = await axios.put(
    `${API_URL}/auth/update-password`,
    { password },
    { headers: getAuthHeaders(token) }
  );
  return res.data.message;
};

export const deleteAllTasks = async (token: string) => {
  const res = await axios.delete(`${API_URL}/tasks/delete-all`, {
    headers: getAuthHeaders(token),
  });
  return res.data.message;
};
