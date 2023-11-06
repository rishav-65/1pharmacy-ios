import { config } from "@APIConfig";
import { GetURLOptions } from "./types";

const APIURLCollection: { [key: string]: string | number } = {
    GENERATE_LOGIN_OTP: 'user/otp/generate',
    USER_LOGIN: 'user/login'
};

export const getURL = (options: GetURLOptions): string => {
    const { key, pathParams, queryParams } = options;
    const basePath = APIURLCollection[key]

    const pathWithParams = basePath + (pathParams ? `/${pathParams}` : '');

    const queryKeys = Object.keys(queryParams || {});

    const pathWithQuery = pathWithParams
        + (queryKeys.length > 0
            ? ('?' + queryKeys.map(queryKey => `${queryKey}=${(queryParams || {})[queryKey]}`).join('&'))
            : '');

    return config.baseURL + pathWithQuery;
}

export default APIURLCollection;