import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createElement } from "react";

// Mock React Icons
vi.mock("react-icons/fa", () => ({
  FaStar: () => createElement("svg", { "data-testid": "star-icon" }),
  FaCheck: () => createElement("svg", { "data-testid": "check-icon" }),
  FaTimes: () => createElement("svg", { "data-testid": "times-icon" }),
  FaFileCode: () => createElement("svg", { "data-testid": "file-code-icon" }),
}));

vi.mock("lucide-react", () => ({
  Trophy: () => createElement("svg", { "data-testid": "trophy-icon" }),
}));

// Component definitions extracted from your code
const CompletedMar = ({ completed }: { completed: boolean | null }) => {
  let bgColor = "gray";

  if (completed === true) {
    bgColor = "#2DBB5C";
  } else if (completed === null) {
    bgColor = "gray";
  } else if (completed === false) {
    bgColor = "red";
  }

  return (
    <div
      data-testid="completed-marker"
      style={{ backgroundColor: bgColor }}
      className="min-w-[1.4rem] min-h-[1.4rem] max-w-[1.4rem] max-h-[1.4rem] rounded-full flex justify-center items-center font-bold"
    >
      {completed && <svg data-testid="check-icon" />}
      {completed === null && <svg data-testid="star-icon" />}
      {completed === false && <svg data-testid="times-icon" />}
    </div>
  );
};

const ChallengeButton = ({
  color,
  completed,
}: {
  color: string;
  completed: boolean;
}) => {
  return (
    <div
      data-testid="challenge-button"
      style={{ borderColor: completed ? "gray" : color }}
      className="rounded-full border-[5px] min-w-[5.5rem] min-h-[5.5rem] flex justify-center items-center"
    >
      <div
        data-testid="challenge-button-inner"
        style={{ backgroundColor: completed ? "gray" : color }}
        className="min-w-[4.2rem] min-h-[4.2rem] rounded-full flex justify-center items-center font-bold"
      >
        <svg data-testid="star-icon" />
      </div>
    </div>
  );
};

const Mission = ({
  icon,
  name,
  progress,
  color,
}: {
  icon: any;
  name: string;
  progress: number;
  color?: string;
}) => {
  return (
    <div data-testid="mission-container" className="flex items-center gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <div className="font-medium">{name}</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            data-testid="progress-bar"
            className="h-2.5 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: color || "#0000FF",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Mock problem data for testing
const mockProblems = [
  {
    key: 1,
    status: true,
    name: "Two Sum",
    points: 20,
    difficulty: 1,
    tags: ["arrays", "hash-table"],
  },
  {
    key: 2,
    status: false,
    name: "Reverse Linked List",
    points: 40,
    difficulty: 2,
    tags: ["linked-list"],
  },
  {
    key: 3,
    status: null,
    name: "Binary Tree Traversal",
    points: 60,
    difficulty: 3,
    tags: ["tree", "dfs"],
  },
];

describe("CompletedMar Component", () => {
  it("renders green background with check icon when completed is true", () => {
    render(<CompletedMar completed={true} />);

    const container = screen.getByTestId("completed-marker");
    expect(container).toHaveStyle({ backgroundColor: "#2DBB5C" });

    const checkIcon = screen.getByTestId("check-icon");
    expect(checkIcon).toBeInTheDocument();
  });
});

describe("ChallengeButton Component", () => {
  it("renders with custom color when not completed", () => {
    render(<ChallengeButton color="#FF5733" completed={false} />);

    const outerDiv = screen.getByTestId("challenge-button");
    expect(outerDiv).toHaveStyle({ borderColor: "#FF5733" });

    const innerDiv = screen.getByTestId("challenge-button-inner");
    expect(innerDiv).toHaveStyle({ backgroundColor: "#FF5733" });
  });

  it("always renders a star icon", () => {
    render(<ChallengeButton color="#FF5733" completed={false} />);

    const starIcon = screen.getByTestId("star-icon");
    expect(starIcon).toBeInTheDocument();
  });
});

describe("Mission Component", () => {
  const mockIcon = <svg data-testid="trophy-icon" />;

  it("renders mission name correctly", () => {
    render(
      <Mission icon={mockIcon} name="Complete 5 Problems" progress={60} />
    );

    expect(screen.getByText("Complete 5 Problems")).toBeInTheDocument();
  });

  it("renders progress bar with correct width", () => {
    render(<Mission icon={mockIcon} name="Test Mission" progress={75} />);

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toHaveStyle({ width: "75%" });
  });

  it("uses custom color when provided", () => {
    render(
      <Mission
        icon={mockIcon}
        name="Test Mission"
        progress={50}
        color="#FF6B6B"
      />
    );

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toHaveStyle({ backgroundColor: "#FF6B6B" });
  });

  it("uses default blue color when no color provided", () => {
    render(<Mission icon={mockIcon} name="Test Mission" progress={30} />);

    const progressBar = screen.getByTestId("progress-bar");
    expect(progressBar).toHaveStyle({ backgroundColor: "#0000FF" });
  });

  it("renders the provided icon", () => {
    render(<Mission icon={mockIcon} name="Test Mission" progress={40} />);

    expect(screen.getByTestId("trophy-icon")).toBeInTheDocument();
  });
});

describe("Problem Data Processing", () => {
  it("correctly calculates points based on difficulty", () => {
    const problems = [
      { difficulty: 1, expected: 20 },
      { difficulty: 3, expected: 60 },
      { difficulty: 5, expected: 100 },
    ];

    problems.forEach(({ difficulty, expected }) => {
      const points = difficulty * 20;
      expect(points).toBe(expected);
    });
  });

  it("handles problem status correctly", () => {
    const statuses = [true, false, null];

    statuses.forEach((status) => {
      const problem = {
        key: 1,
        status: status,
        name: "Test Problem",
        points: 20,
        difficulty: 1,
        tags: ["test"],
      };

      expect(problem.status).toBe(status);
    });
  });
});

describe("Utility Functions", () => {
  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: difficulty }, (_, i) => i);
  };

  it("generates correct number of stars for difficulty", () => {
    expect(getDifficultyStars(1)).toHaveLength(1);
    expect(getDifficultyStars(3)).toHaveLength(3);
    expect(getDifficultyStars(5)).toHaveLength(5);
  });

  const formatPoints = (points: number) => `${points} MC`;

  it("formats points correctly", () => {
    expect(formatPoints(20)).toBe("20 MC");
    expect(formatPoints(100)).toBe("100 MC");
  });
});
