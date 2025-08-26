import { render, screen } from "@/test-utils/testing-library-exports";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import "@testing-library/jest-dom";

import userEvent from "@testing-library/user-event";

test("renders tooltip content on hover", async () => {
  render(
    <TooltipWrapper content="Tooltip text">
      <button>Hover me</button>
    </TooltipWrapper>
  );

  const button = screen.getByText("Hover me");
  expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();

  await userEvent.hover(button);
  expect(await screen.findByText("Tooltip text")).toBeInTheDocument();

  await userEvent.unhover(button);
  expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
});
