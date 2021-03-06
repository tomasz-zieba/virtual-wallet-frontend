import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import * as action from './index';

const onLoginSuccess = (token, userId) => ({
  type: actionTypes.LOGIN_SUCCESS,
  token,
  userId,
});

export const authLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expiryDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

const onAuthFail = () => ({
  type: actionTypes.AUTH_FAIL,
});
export const checkAuthTimeout = (expirationTime) => (dispatch) => {
  setTimeout(() => {
    dispatch(authLogout());
  }, expirationTime * 1000);
};

export const authLogin = (event, authData) => async (dispatch) => {
  event.preventDefault();
  dispatch(action.onRequestSended());
  try {
    const res = await fetch('https://virtual-wallet-tz.herokuapp.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: authData.name,
        password: authData.password,
      }),
    });
    dispatch(action.onGetResponse());
    if (res.status === 401) {
      throw new Error('User name or password are wrong.');
    }
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Could not authenticate you.');
    }
    const resData = await res.json();
    localStorage.setItem('token', resData.token);
    localStorage.setItem('userId', resData.userId);
    const remainingMilliseconds = 60 * 60 * 1000;
    const expiryDate = new Date(
      new Date().getTime() + remainingMilliseconds,
    );
    localStorage.setItem('expiryDate', expiryDate.toISOString());
    checkAuthTimeout(remainingMilliseconds);
    dispatch(onLoginSuccess(resData.token, resData.userId));
  } catch (error) {
    dispatch(action.onInfoELementOpen('error', error.message));
    dispatch(onAuthFail());
  }
};

export const authSignup = (event, authData) => async (dispatch) => {
  event.preventDefault();
  dispatch(action.onRequestSended());
  try {
    const res = await fetch('https://virtual-wallet-tz.herokuapp.com/auth/signup', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: authData.password,
        name: authData.name,
      }),
    });
    dispatch(action.onGetResponse());
    if (res.status === 422) {
      throw new Error("Validation failed! Make sure user name isn't used yet!");
    }
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Creating a user failed!');
    }
    onAuthFail();
    dispatch(push({ pathname: '/login', title: 'Logowanie' }));
  } catch (err) {
    dispatch(action.onInfoELementOpen('error', err.message));
  }
};

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(authLogout());
  } else {
    const expirationDate = new Date(localStorage.getItem('expiryDate'));
    if (expirationDate <= new Date()) {
      dispatch(authLogout());
    } else {
      const userId = localStorage.getItem('userId');
      dispatch(onLoginSuccess(token, userId));
      dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
    }
  }
};
