import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import Router from "./Router";
import { authSelector, logout, setUser } from "./state/authSlice";
import { useProfileQuery } from "./state/usersApi";

function App() {
  useAutoFetchUserProfile();

  return <Router />;
}

export default App;

function useAutoFetchUserProfile() {
  const { accessToken, user } = useSelector(authSelector);
  const dispatch = useDispatch();

  // Fetch user profile if is auth and user data missing
  const { data: newUser, isSuccess } = useProfileQuery(accessToken, {
    skip: !accessToken || !!user,
  });

  // Store user profile in the Redux state
  useEffect(() => {
    if (newUser && isSuccess) {
      dispatch(setUser(newUser));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, newUser]);

  // Logout is the auth token is missing
  if (!accessToken && user) {
    dispatch(logout());
  }
}
