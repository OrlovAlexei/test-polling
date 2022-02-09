import { LinksGenerationStatus } from "./channel";

export async function generateLinks() {
  return fetch("generateLinks", {
    method: "post",
  }).then((d) => d.json());
}

export async function checkLinksGenetarionStatus(): Promise<{
  status: LinksGenerationStatus;
  count?: number;
}> {
  return fetch("getStatus", {
    method: "get",
  }).then((d) => d.json());
}
