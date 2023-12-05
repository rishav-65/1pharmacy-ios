import moment from "moment";
import React from "react";

const bill = (billData: any) => ({
    icons: [],
    tabs:[
        {
            title: 'Summary',
            key: 'summary',
            sceneType: 'list',
            content:{
                searchEnabled: false,
                sections: [
                    {
                        SectionComponent: React.Fragment,
                        title: 'Details',
                        cards: [
                            {
                                card_id: 'card_9',
                                displayData:[
                                    {
                                        key: {
                                            text: 'Billed On:',
                                        },
                                        value: {
                                            text: `${moment.unix(billData.bill.billedOn).format('DD-MMM-YYYY | hh:mm A')}`,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'Customer Name:',
                                        },
                                        value: {
                                            text: billData.bill.name,
                                        }
                                    },
                                    // {
                                    //     key: {
                                    //         text: 'Contact Number:',
                                    //     },
                                    //     value: {
                                    //         text: '',
                                    //     }
                                    // },
                                    {
                                        key: {
                                            text: 'Total Amount:',
                                        },
                                        value: {
                                            text: `₹ ${billData.bill.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'GST Amount:',
                                        },
                                        value: {
                                            text: `₹ ${billData.bill.gst.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'Discount:',
                                        },
                                        value: {
                                        text: `₹ ${billData.bill.discount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'Net Amount:',
                                        },
                                        value: {
                                            text: `₹ ${billData.bill.netAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
                                        }
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        SectionComponent: React.Fragment,
                        title: 'Ordered Items',
                        cards: (billData.bill.items || []).map((item: any) => ({
                            card_id: 'card_7',
                            title: item.name || '',
                            details: [
                                `Expiry: ${moment.unix(item.expiry).format('MM/YY')}`,
                                `Batch: ${item.batchNo}`,
                                `Quantity: ${item.billQty}`
                            ],
                            highlightDetails: [
                                `Total: ${item.netItemAmount}`
                            ],
                            imgURL: item.appImage
                        }))
                    }
                ]
            }
        },
        {
            title: 'Files',
            key: 'files',
            sceneType: 'list',
            content:{
                searchEnabled: false,
                sections: [
                    {
                        SectionComponent: React.Fragment,
                        cards: []
                    },
                ]
            }
        }
    ]
})

export default bill;