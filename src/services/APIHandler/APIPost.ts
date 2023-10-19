import APIFetch from "./APIFetch";
import Methods from "./methods";
import { APIPostParams } from "./types";

const APIPost = async (params: APIPostParams) => {
    try {
        const response = await APIFetch({
            method: Methods.POST,
            url: params.url,
            body: params.body,
            customHeaders: params.customHeaders
        })

        const responseJSON = response.json();

        (params.resolve || (() => { }))(responseJSON)

        return responseJSON;
    } catch (error) {
        (params.reject || (() => { }))(error);

        return error
    }
}

export default APIPost;