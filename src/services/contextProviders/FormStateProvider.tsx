import { getActiveUserSession, setActiveUserSessionIndex, setUserSessions } from '@auth';
import { LoadingScreen } from '@commonComponents';
import moment from 'moment';
import React from 'react';

const generateSaleStateTemplate = () => ({
  "name": "",
  "customerId": "",
  "estimate": false,
  "note": "",
  "contactNo": "",
  "doctor": "",
  "doctorId": "",
  "billedOn": moment().unix(),
  "deliveryCharge": 0,
  "discount": 0,
  "discountPercent": 0,
  "paymentMode": "Cash",
  "reminderDay": "",
  "whatsAppBill": true,
  "items": [],
  "totalAmount": 0.00,
  "netAmount": 0.00,
  "totalSaving": 0.00,
  "gst": 0.00,
  "roundOff": 0,
  "totalMarginPercent": 100
})

const initialState: { [key: string]: any } = {
  saleFormState: [{}, {}, {}, {}, {}],
  purchaseFormState: {},
  initializeSaleFormState: (index: number) => { },
  initializePurchaseFormState: () => { },
  getSalePatcherByIndex: () => { }
}

export const FormStateContext = React.createContext(initialState);

const FormStateProvider = (props: { children: React.ReactNode }) => {
  const [saleFormState, setSaleFormState] = React.useState<ReturnType<typeof generateSaleStateTemplate>[]>([]);
  const [purchaseFormState, setPurchaseFormState] = React.useState({});

  const initializeSaleFormState = (index: number) => {
    const tempSaleFormState = saleFormState;

    tempSaleFormState[index] = generateSaleStateTemplate();

    setSaleFormState(tempSaleFormState);
  }

  const getSalePatcherByIndex = (index: number) => {
    return (
      (data: { [key: string]: any }) => {
        setSaleFormState((state: any) => {
          const tempSaleFormState = state.map((sale: any) => ({
            ...sale
          }));

          tempSaleFormState[index] = { ...tempSaleFormState[index], ...data };

          return tempSaleFormState;
        });
      }
    )
  }

  const initializePurchaseFormState = () => {

  }

  return (
    <FormStateContext.Provider
      value={{
        saleFormState,
        purchaseFormState,
        initializeSaleFormState,
        initializePurchaseFormState,
        getSalePatcherByIndex
      }}>
      {props.children}
    </FormStateContext.Provider>
  );
};

export default FormStateProvider
