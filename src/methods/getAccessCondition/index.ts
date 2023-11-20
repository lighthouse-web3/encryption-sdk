import axios from "axios";
import defaultConfig from "../../config";
import { IGetAccessCondition } from "../../types";


export const getAccessCondition = async (cid: string): Promise<{ data: IGetAccessCondition }> => {
    try {
        const conditions = await axios.get(`${defaultConfig.isDev ? defaultConfig.lighthouseBLSNodeDev : defaultConfig.lighthouseAuthNode}/api/fileAccessConditions/get/${cid}`)
        return { data: conditions.data }
    } catch (error: any) {
        throw new Error(error.message)
    }
}
