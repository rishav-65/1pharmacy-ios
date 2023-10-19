import APIFetch from "./APIFetch";
import Methods from "./methods";
import { APIPutParams } from "./types";

const APIPut = async (params: APIPutParams) => {
    try {
        const response = await APIFetch({
            method: Methods.PUT,
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

export default APIPut;