// src/tests/Rewards.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// Adjust the import path as needed; for example, if 'leaderboard' is in 'src/app/leaderboard' relative to the project root:
import Leaderboard from "../src/app/leaderboard/leaderboard";

// Mock useUser para simular usuario logueado
vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({ user: { fullName: "Test User", id: "user-1" } }),
}));

vi.mock("@/components/UserProfileModal", () => ({
  default: () => <div>UserProfileModal</div>,
}));

// Mock fetch global para leaderboard API
const mockLeaderboard = [
  {
    id: "1",
    name: "Alice",
    points: 300,
    level: 100,
    image_url: "",
    is_admin: false,
    mail: "a@a.com",
  },
  {
    id: "2",
    name: "Bob",
    points: 250,
    level: 90,
    image_url: "",
    is_admin: false,
    mail: "b@b.com",
  },
  {
    id: "3",
    name: "Charlie",
    points: 200,
    level: 80,
    image_url: "",
    is_admin: false,
    mail: "c@c.com",
  },
  {
    id: "4",
    name: "David",
    points: 150,
    level: 30,
    image_url: "",
    is_admin: false,
    mail: "d@d.com",
  },
];

beforeEach(() => {
  vi.useFakeTimers();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockLeaderboard),
    })
  ) as any;
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("Leaderboard Component", () => {
  it("renders without crashing", () => {
    render(<Leaderboard />);
    expect(screen.getByText(/Rank/i)).toBeInTheDocument();
  });
});
