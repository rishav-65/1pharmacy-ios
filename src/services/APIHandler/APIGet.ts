import APIFetch from "./APIFetch";
import Methods from "./methods";
import { APIGetParams } from "./types";

const APIGet = async (params: APIGetParams) => {
    try {
        const response = await APIFetch({
            method: Methods.GET,
            url: params.url,
            customHeaders: params.customHeaders
        })

        const responseJSON = response.json();

        (params.resolve || (() => { }))(responseJSON)

        return responseJSON;
    } catch (error) {
        (params.reject||(()=>{}))(error);

        return error
    }
}

export default APIGet;