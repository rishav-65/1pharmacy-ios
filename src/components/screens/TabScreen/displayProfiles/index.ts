import bill from "./bill";
import order from "./order";
import purchase from "./purchase";

const dataProfiles: { [key: string]: Function } = {
    bill,
    order,
    purchase
}

const parseDataByProfile = (profile: string, data: any) => (dataProfiles[profile] || ((data: any) => data))(data);

export { bill, order, purchase, parseDataByProfile };