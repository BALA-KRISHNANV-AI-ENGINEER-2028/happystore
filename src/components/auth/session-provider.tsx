// =============================================================================
// Happy Store — Session Provider
// Initializes auth state from localStorage on app mount and dispatches to
// Redux. Wrap the app with this component inside the Redux Provider.
// =============================================================================

import { useEffect, type ReactNode } from "react";
import { useAppDispatch } from "@/store";
import { initSessionThunk } from "@/store/slices/authSlice";

export function SessionProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initSessionThunk());
  }, [dispatch]);

  return <>{children}</>;
}
