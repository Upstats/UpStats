import jwtDecode from "jwt-decode";
import http from "./httpService";

const apiEndpoint = "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });

  window.localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  window.localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  window.localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = window.localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return window.localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};
