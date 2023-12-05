import APIFetch from "./APIFetch";
import Methods from "./methods";
import { APIDeleteParams } from "./types";

const APIDelete = async (params: APIDeleteParams) => {
    try {
        const response = await APIFetch({
            method: Methods.DELETE,
            url: params.url,
            body: params.body,
            customHeaders: params.customHeaders
        })

        const responseJSON = await response.json();

        (params.resolve || (() => { }))(responseJSON)

        return responseJSON;
    } catch (error) {
        (params.reject || (() => { }))(error);

        return error
    }
}

export default APIDelete;