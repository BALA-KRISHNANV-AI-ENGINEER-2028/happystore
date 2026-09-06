// =============================================================================
// Happy Store — useAuth Hook
// Provides a convenient interface to auth state from Redux.
// =============================================================================

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginThunk, logoutThunk } from "@/store/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, role, error } = useAppSelector(
    (s) => s.auth,
  );

  const login = useCallback(
    (email: string, password: string, remember?: boolean) =>
      dispatch(loginThunk({ email, password, remember })).unwrap(),
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutThunk()).unwrap(), [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    role,
    error,
    login,
    logout,
  };
}
