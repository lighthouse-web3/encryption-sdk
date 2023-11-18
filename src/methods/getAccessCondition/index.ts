import api from "../../axios";
import { IGetAccessCondition } from "../../types";


export const getAccessCondition = async (cid: string): Promise<{ data: IGetAccessCondition }> => {
    try {
        const conditions = await api.get(`/api/fileAccessConditions/get/${cid}`)
        return { data: conditions.data }
    } catch (error: any) {
        throw new Error(error.message)
    }
}
