import config from "../config";
import { json } from "stream/consumers";

export const isCidReg = (cid: string) =>
  /Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50}/.test(
    cid
  );

export const isEqual = (...objects: any) =>
  objects.every(
    (obj: any) => JSON.stringify(obj) === JSON.stringify(objects[0])
  );

export async function API_NODE_HANDLER(
  endpoint: string,
  verb: "GET" | "POST" | "DELETE" | "PUT",
  auth_token: string = "",
  body: any = null,
  retryCount = 3
) {
  const url = new URL(
    `${
      config.isDev ? config.lighthouseBLSNodeDev : config.lighthouseAuthNode
    }${endpoint}`
  );

  const init: any = {
    method: verb,
    headers: {
      "Content-type": "application/json",
      Authorization: auth_token ? `Bearer ${auth_token}` : "",
    },
  };

  if ((verb === "POST" || verb === "PUT" || verb === "DELETE") && body) {
    init.body = JSON.stringify(body);
  }
  for (let i = 0; i < retryCount; i++) {
    try {
      const response = await fetch(url.toString(), init);

      if (!response.ok) {
        if (response.status == 404) {
          throw new Error(
            JSON.stringify({
              message: "fetch Error",
              statusCode: response.status,
            })
          );
        }
        const errorBody = await response.json();
        throw new Error(
          JSON.stringify({ ...errorBody, statusCode: response.status })
        );
      }

      return response.json();
    } catch (error: any) {
      if (!error?.message?.includes("fetch")) {
        throw error;
      }
      if (i === retryCount - 1) throw error; // Throw error on the last attempt
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
    }
  }
}
