
import axios from 'axios';
import decode from 'jwt-decode';
import { browserHistory } from 'react-router';


const URL = 'http://localhost:5000/auth/login'
const TOKEN_KEY = 'access_token';

export async function login(username, password) {

  try {

    const res = await axios.post(URL, { username: username, password: password });
    localStorage.setItem(TOKEN_KEY, res.data.token);
  }
  catch (error) {
    return false;
  }

  return true;
}

export function logout() {
  clearAccessToken();
  browserHistory.push('/');
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserInfo() {
  const decoded = decodeToken(getToken())
  return decoded ? decoded.uinf : null 
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({ pathname: '/' });
  }
}

export function isLoggedIn() {
  const idToken = getToken();
  return !!idToken && !isTokenExpired(idToken);
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function urlBase64Decode(str) {

  var output = str.replace(/-/g, "+").replace(/_/g, "/");

  switch (output.length % 4) {
    case 0: {
      break;
    }

    case 2: {
      output += "==";
      break;
    }

    case 3: {
      output += "=";
      break;
    }

    default: {
      throw Error("Illegal base64url string!");
    }
  }

  return decodeURIComponent(escape(window.atob(output)));
}

function decodeToken(token) {

  if (token) {
    
    var parts = token.split(".");

    if (parts.length !== 3) {
      throw new Error("JWT must have 3 parts");
    }

    var decoded = urlBase64Decode(parts[1]);

    if (!decoded) {
      throw new Error("Cannot decode the token");
    }

    return JSON.parse(decoded);
  }

  return null
}

