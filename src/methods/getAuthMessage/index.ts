import { API_NODE_HANDLER } from "../../util";
import { AuthMessage } from "../../types";

export const getAuthMessage = async (address: string): Promise<AuthMessage> => {
  try {
    const data = await API_NODE_HANDLER(`/api/message/${address}`, "GET");
    return { message: data[0].message, error: null };
  } catch (err: any) {
    return { message: null, error: JSON.parse(err?.message) };
  }
};
