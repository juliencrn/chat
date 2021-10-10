import { useSelector } from 'react-redux'

import { AuthState } from '../state/authSlice';
import { RootState } from '../state/store';

function useAuth(): null | AuthState {
    const auth = useSelector((state: RootState) => state.auth)
  
    if (!auth.user || !auth.accessToken) {
        return null
    }
   
    return auth as AuthState
}

  export default useAuth;