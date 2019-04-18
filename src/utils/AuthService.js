
import axios from 'axios';
import decode from 'jwt-decode';
import { browserHistory } from 'react-router';
const ID_TOKEN_KEY = 'access_token';

export async function login(username, password) {
 
  try {

    const res = await axios.post('http://localhost:5000/auth/login', { username: username, password: password });    
    localStorage.setItem(ID_TOKEN_KEY, res.data.token);
  } 
  catch (error) {
    console.log(error);
    return false;
  }

  return true;
}

export function logout() {
  clearAccessToken();
  browserHistory.push('/');
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({pathname: '/'});
  }
}

export function isLoggedIn() {
  const idToken = getIdToken();
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
  localStorage.removeItem(ID_TOKEN_KEY);
}