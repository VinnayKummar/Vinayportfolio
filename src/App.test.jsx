import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders key portfolio sections", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: /full-stack engineer/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About Me" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Certifications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Education" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Let's Connect" })).toBeInTheDocument();
  });
});
