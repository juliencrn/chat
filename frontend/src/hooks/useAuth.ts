import { useSelector } from "react-redux";

import { authSelector, AuthState } from "../state/authSlice";

function useAuth(): null | AuthState {
  const auth = useSelector(authSelector);

  if (!auth.user || !auth.accessToken) {
    return null;
  }

  return auth as AuthState;
}

export default useAuth;
