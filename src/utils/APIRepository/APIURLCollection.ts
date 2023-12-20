import { config } from "@APIConfig";
import { GetURLOptions } from "./types";

const APIURLCollection: { [key: string]: string | number } = {
    GENERATE_LOGIN_OTP: 'user/otp/generate',
    USER_LOGIN: 'user/login',
    COMPARISON_DASHBOARD: 'comparison_dashboard',
    SALES_DASHBOARD: 'sales_dashboard',
    PURCHASE_DASHBOARD: 'purchase_listing',
    ALL_SKU: 'all_sku',
    SALE_DASHBOARD: 'bill_history',
    ORDER_DASHBOARD: 'order_listing',
    PURCHASE_ENTRY: 'purchase_entry',
    BILL_ENTRY: 'get_bill',
    ORDER_ENTRY: 'convert_order_bill',
    NEW_STOCK: 'new_stock_dashboard',
    NEW_SALES_DASHBOARD: 'new_sales_dashboard',
    NEW_PURCHASE_DASHBOARD: 'new_purchase_dashboard',
    SEARCH_SALES_ITEM: 'search_sales_item',
    SKU_STOCK: 'sku_stock',
    STORE_CUSTOMERS: 'store_customers',
    STORE_DOCTOR_LISTING: 'store_doctor_listing',
    SUBMIT_BILL: 'submit_bill',
    SUPPLIER_LISTING: 'supplier_listing'
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