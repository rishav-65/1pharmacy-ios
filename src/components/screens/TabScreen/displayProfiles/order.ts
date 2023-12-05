import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    
})

const order = (orderData: any) => ({
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
                        title: 'Ordered Items',
                        cards: (orderData.items || []).map((item: any) => ({
                            card_id: 'card_7',
                            title: item.name || '',
                            details: [
                                `Quantity: ${item.billQty}`,
                                `${item.packaging}`
                            ],
                            highlightDetails: [
                                `Total: ${item.sellingPrice}`
                            ],
                            imgURL: item.appImage
                        }))
                    },
                    {
                        SectionComponent: React.Fragment,
                        title: 'DeliveryItems',
                        cards: [
                            {
                                card_id: 'card_8',
                                title: orderData.name,
                                actions: [
                                    {
                                        action: 'link',
                                        icon: 'phone',
                                        actionParams: [`tel:${orderData.contactNo}`]
                                    },
                                    {
                                        action: 'link',
                                        icon: ['fab', 'whatsapp'],
                                        actionParams: [`https://wa.me/${orderData.contactNo}`]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            title: 'Details',
            key: 'details',
            sceneType: 'list',
            content:{
                searchEnabled: false,
                sections: [
                    {
                        SectionComponent: React.Fragment,
                        cards: [
                            {
                                card_id: 'card_9',
                                displayData:[
                                    // {
                                    //     key: {
                                    //         text: 'Ordered On:',
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
                                            text: `₹ ${(orderData.items || []).reduce((total: number, currentItem: any)=>total + currentItem.sellingPrice, 0)}`,
                                        }
                                    },
                                    // {
                                    //     key: {
                                    //         text: 'Address:',
                                    //     },
                                    //     value: {
                                    //         text: '',
                                    //     }
                                    // },
                                    // {
                                    //     key: {
                                    //         text: 'Payment Status:',
                                    //     },
                                    //     value: {
                                    //         text: '',
                                    //     }
                                    // },
                                    // {
                                    //     key: {
                                    //         text: 'Status:',
                                    //     },
                                    //     value: {
                                    //         text: '',
                                    //     }
                                    // },
                                    // {
                                    //     key: {
                                    //         text: 'Delivery Mode:',
                                    //     },
                                    //     value: {
                                    //         text: '',
                                    //     }
                                    // },
                                    // {
                                    //     key: {
                                    //         text: 'Payment Mode:',
                                    //     },
                                    //     value: {
                                    //         text: '',
                                    //     }
                                    // }
                                ]
                            }
                        ]
                    },
                ]
            }
        }
    ]
})

export default order;