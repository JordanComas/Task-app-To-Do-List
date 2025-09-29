import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

/**
 * Login user with email + password
 * @param email
 * @param password
 * @returns { token, user }
 */
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data; // { token, user }
};

/**
 * Signup user with name, email, and password
 * @param name
 * @param email
 * @param password
 * @returns { token, user }
 */
export const signup = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    name,
    email,
    password,
  });
  return response.data; // { token, user }
};
