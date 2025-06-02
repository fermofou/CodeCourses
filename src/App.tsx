import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import Home from "./app/page";
import LoginPage from "./app/login/page";
import ChallengePage from "./app/challenge/page";
import ChallengesPage from "./app/challenges/page";
import RewardsPage from "./app/rewards/page";
import LeaderboardPage from "./app/leaderboard/page";
import ReposPage from "./app/repos/repos";
import AdminPage from "./app/admin/page";
import Layout from "./app/layout";
import SignUpPage from "./app/signup/page";
import PrivacyPolicy from "./components/privacy";
import Terms from "./components/terms";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isSignedIn ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={isSignedIn ? <Navigate to="/" replace /> : <SignUpPage />}
          />
          <Route
            path="/challenge"
            element={
              !isSignedIn ? <Navigate to="/login" replace /> : <ChallengePage />
            }
          />
          <Route
            path="/challenges"
            element={
              !isSignedIn ? (
                <Navigate to="/login" replace />
              ) : (
                <ChallengesPage />
              )
            }
          />
          <Route
            path="/rewards"
            element={
              !isSignedIn ? <Navigate to="/login" replace /> : <RewardsPage />
            }
          />
          <Route
            path="/leaderboard"
            element={
              !isSignedIn ? (
                <Navigate to="/login" replace />
              ) : (
                <LeaderboardPage />
              )
            }
          />

          <Route
            path="/admin"
            element={
              !isSignedIn ? <Navigate to="/login" replace /> : <AdminPage />
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
