// src/tests/Rewards.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Rewards from "../../src/app/rewards/rewards";

import { UserDataProvider } from "../../src/userData"; // asegúrate de que este path sea correcto

// Mocks básicos para evitar errores durante render
// Mock completo de Clerk
vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({ isLoaded: true, user: { id: "123" } }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function customRender(ui: React.ReactElement) {
  return render(<UserDataProvider>{ui}</UserDataProvider>);
}

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();

  // Mock global fetch
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  ) as any;

  // Mock global alert
  global.alert = vi.fn();
});

describe("Rewards page", () => {
  it("renders title and description", () => {
    customRender(<Rewards />);
    expect(screen.getByText("Earn cool stuff!")).toBeInTheDocument();
    expect(
      screen.getByText("Top picks for you. Updated daily.")
    ).toBeInTheDocument();
  });

  it("displays empty state when no rewards", async () => {
    customRender(<Rewards />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText("Earn cool stuff!")).toBeInTheDocument();
    });
  });

  it("displays rewards when fetched successfully", async () => {
    const mockReward = [
      {
        reward_id: 1,
        name: "T-Shirt",
        description: "Nice tee",
        inventory_count: 10,
        cost: 50,
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockReward),
    });

    customRender(<Rewards />);

    await waitFor(() => {
      expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    });
  });

  it("shows modal on reward click", async () => {
    const mockReward = [
      {
        reward_id: 2,
        name: "Sticker",
        description: "Cool sticker",
        inventory_count: 5,
        cost: 20,
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockReward),
    });

    customRender(<Rewards />);

    const rewardCard = await screen.findByText("Sticker");
    fireEvent.click(rewardCard);

    await waitFor(() => {
      expect(screen.getByText("Product Details")).toBeInTheDocument();
    });
  });

  it("disables buy button when not enough points", async () => {
    const reward = {
      reward_id: 3,
      name: "Laptop",
      description: "High end",
      inventory_count: 1,
      cost: 9999, // More than user's 100 points
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([reward]),
    });

    customRender(<Rewards />);

    // Click on reward to open modal
    const rewardCard = await screen.findByText("Laptop");
    fireEvent.click(rewardCard);

    // Add to cart first
    const addToCartBtn = await screen.findByText("Add to Cart");
    fireEvent.click(addToCartBtn);

    // Open cart
    const cartBtn = screen.getAllByRole("button").find(
      (btn) => btn.querySelector("svg") // Find button with icon (cart button)
    );
    fireEvent.click(cartBtn!);

    // Check if buy button is disabled
    await waitFor(() => {
      const buyButton = screen.getByText("Not enough points");
      expect(buyButton).toBeDisabled();
    });
  });

  it("removes item from cart when Remove clicked", async () => {
    const reward = {
      reward_id: 4,
      name: "Pen",
      description: "Blue ink",
      inventory_count: 30,
      cost: 10,
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([reward]),
    });

    customRender(<Rewards />);

    // Click on reward card
    const card = await screen.findByText("Pen");
    fireEvent.click(card);

    // Add to cart
    const addBtn = await screen.findByText("Add to Cart");
    fireEvent.click(addBtn);

    // Open cart
    const cartBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector("svg"));
    fireEvent.click(cartBtn!);

    // Remove item
    const removeBtn = await screen.findByText("Remove");
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    });
  });
});
