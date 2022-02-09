import { rest } from "msw";
import { LinksGenerationStatus } from "../channel";

let count = 0;

export const handlers = [
  rest.post("*/generateLinks", (req, res, ctx) => {
    ctx.delay(500);
    return res(
      ctx.json({
        ok: true,
      })
    );
  }),
  rest.get("*/getStatus", (req, res, ctx) => {
    if (count === 4) {
      count = 0;
      return res(
        ctx.body(
          JSON.stringify({
            status: LinksGenerationStatus.READY,
            count: 777,
          })
        )
      );
    }

    count++;
    return res(
      ctx.body(
        JSON.stringify({
          status: LinksGenerationStatus.PROCESSING,
        })
      )
    );
  }),
];
