import defaultConfig from "../../config";
import { IGetAccessCondition } from "../../types";
import { API_NODE_HANDLER } from "../../util";


export const getAccessCondition = async (cid: string): Promise<{ data: IGetAccessCondition }> => {
    try {
        const conditions = await API_NODE_HANDLER(`/api/fileAccessConditions/get/${cid}`, "GET")
        return { data: conditions }
    } catch (error: any) {
        throw new Error(error.message)
    }
}
