import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useUser } from "@clerk/clerk-react";

// Define types for your user data
interface UserData {
  name?: string;
  points?: number;
  level?: number;
  admin?: boolean;
  // Add any other user properties you need
}

interface UserDataState {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

type UserDataAction =
  | { type: "LOADING" }
  | { type: "SET_USER_DATA"; payload: UserData }
  | { type: "ERROR"; payload: string }
  | { type: "CLEAR" };

// Create context with type safety
const UserDataContext = createContext<
  | {
      state: UserDataState;
      dispatch: React.Dispatch<UserDataAction>;
      refreshUserData: () => void;
    }
  | undefined
>(undefined);

// Initial state
const initialState: UserDataState = {
  userData: null,
  loading: false,
  error: null,
};

// Reducer function
function userDataReducer(
  state: UserDataState,
  action: UserDataAction
): UserDataState {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
        loading: false,
        error: null,
      };
    case "ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

// Provider component
export function UserDataProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [state, dispatch] = useReducer(userDataReducer, initialState);

  // Create a reusable fetch function
  const fetchUserData = async () => {
    if (!isSignedIn || !user?.id) return;
    console.log("Fetching user data for:", user.id);

    dispatch({ type: "LOADING" });
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `/user/${user.id}/${user.fullName}/${user.emailAddresses[0].emailAddress}`
      );
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      dispatch({ type: "SET_USER_DATA", payload: data });
    } catch (error) {
      console.error("Error fetching user data:", error);
      dispatch({ type: "ERROR", payload: (error as Error).message });
    }
  };

  const hasFetched = useRef(false);

  // Expose refresh function
  const refreshUserData = () => {
    fetchUserData();
  };

  // Initial fetch
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id && !hasFetched.current) {
      fetchUserData();
      hasFetched.current = true;
    } else if (isLoaded && !isSignedIn) {
      dispatch({ type: "CLEAR" });
    }
  }, [isLoaded, isSignedIn]);

  return (
    <UserDataContext.Provider value={{ state, dispatch, refreshUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

// Custom hook for consuming the context
export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
