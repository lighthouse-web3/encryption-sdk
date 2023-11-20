import axios from "axios";
import defaultConfig from "../../config";
import { AuthMessage } from "../../types";


export const getAuthMessage = async (address: string): Promise<AuthMessage> => {
  try {
    const data = await axios
      .get(`${defaultConfig.isDev ? defaultConfig.lighthouseBLSNodeDev : defaultConfig.lighthouseAuthNode}/api/message/${address}`)
      .then((res) => res.data[0].message);
    return { message: data, error: null };
  } catch (err: any) {
    return { message: null, error: err?.response?.data || err.message };
  }
};
