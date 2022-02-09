import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";
import { LinksGenerationStatus } from "./channel";

let count = 0;

const server = setupServer(
  rest.post("http://localhost/generateLinks", (req, res, ctx) =>
    res(ctx.json({ mocked: true }))
  ),
  rest.get("http://localhost/getStatus", (req, res, ctx) => {
    count++;

    if (count === 1) {
      return res(
        ctx.json({
          status: LinksGenerationStatus.PROCESSING,
        })
      );
    }

    return res(
      ctx.json({
        status: LinksGenerationStatus.READY,
        count: 222,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Show loading message when links generating with real timers", async () => {
  render(<App />);

  userEvent.click(
    screen.getByRole("button", {
      name: "Сгенерировать ссылки",
    })
  );

  await waitFor(() =>
    expect(screen.getByText("Генерация ссылок...")).toBeVisible()
  );

  await sleep(1000);

  await waitFor(() =>
    expect(screen.getByText(/Ссылок сгенерировано: 222/i)).toBeVisible()
  );

  expect(screen.queryByText("Генерация ссылок...")).not.toBeInTheDocument();
});

test("Show loading message when links generating with fake timers", async () => {
  jest.useFakeTimers("modern");

  const utils = render(<App />);

  userEvent.click(
    screen.getByRole("button", {
      name: "Сгенерировать ссылки",
    })
  );

  await waitFor(() =>
    expect(screen.getByText("Генерация ссылок...")).toBeVisible()
  );

  // jest.advanceTimersByTime(1000);

  // await waitFor(() =>
  //   expect(screen.getByText(/Ссылок сгенерировано: 222/i)).toBeVisible()
  // );

  // expect(screen.queryByText("Генерация ссылок...")).not.toBeInTheDocument();

  utils.debug();
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function flushPromises() {
  return new Promise(jest.requireActual("timers").setImmediate);
}
