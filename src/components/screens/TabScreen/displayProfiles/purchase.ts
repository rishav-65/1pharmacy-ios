import moment from "moment";
import React from "react";

const purchse = (purchaseData: any) => ({
    icons: [],
    tabs: [
        {
            title: 'Details',
            key: 'details',
            sceneType: 'list',
            content: {
                searchEnabled: false,
                sections: [
                    {
                        SectionComponent: React.Fragment,
                        title: 'Summary',
                        cards: [
                            {
                                card_id: 'card_9',
                                displayData: [
                                    {
                                        key: {
                                            text: 'Purchase Id:',
                                        },
                                        value: {
                                            text: purchaseData.bill.purchaseNo,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'Billed On: ',
                                        },
                                        value: {
                                            text: moment.unix(purchaseData.bill.invoicedOn).format('DD-MMM-YYYY'),
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'Supplier Name:',
                                        },
                                        value: {
                                            text: purchaseData.bill.supplierName,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'Created By:',
                                        },
                                        value: {
                                            text: purchaseData.bill.createdBy,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'GST (₹):',
                                        },
                                        value: {
                                            text: `₹ ${purchaseData.bill.totalGst}`,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'Discount (₹):',
                                        },
                                        value: {
                                            text: `₹ ${purchaseData.bill.totalDiscount}`,
                                        }
                                    },
                                    {
                                        key: {
                                            text: 'Total Amount (₹):',
                                        },
                                        value: {
                                            text: `₹ ${purchaseData.bill.totalValue}`,
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        SectionComponent: React.Fragment,
                        title: 'Items',
                        cards: purchaseData.bill.items.map((item: any) => ({
                            card_id: 'card_8',
                            title: item.name,
                            subtitle: item.packaging,
                            actions: [
                                // {
                                //     action: 'link',
                                //     icon: 'phone',
                                //     actionParams: [`tel:${orderData.contactNo}`]
                                // },
                                // {
                                //     action: 'link',
                                //     icon: 'whatsapp',
                                //     actionParams: [`https://wa.me/${orderData.contactNo}`]
                                // }
                            ],
                            detailItems: [
                                `Quantity: ${item.qty || ''}`,
                                `PTR: ${(item.ptr || 0).toFixed(2) || ''}`,
                                `Free Qty.: ${item.freeQty || ''}`,
                                `Discount: ${(item.discountPrice || 0).toFixed(2) || 0.0}`,
                                `GST: ${item.gst || ''}`,
                                `EXP: ${moment.unix(item.expiry).format('MM/YY') || ''}`,
                                `B.No.: ${item.batchNo || ''}`,
                                `MRP: ${item.mrp.toFixed(2)}`,
                                `Total: ${(item.netitemTotal ||0).toFixed(2)}`,
                            ]
                        }))
                    }
                ]
            }
        },
        {
            title: 'Files',
            key: 'files',
            sceneType: 'list',
            content: {
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

export default purchse;