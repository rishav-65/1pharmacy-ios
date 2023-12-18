export const calculateTotal = (
    {
        mrp,
        qty,
        discount,
        overallDiscount,
        gst
    }: {
        mrp: number | string,
        qty: number | string,
        discount?: number | string,
        overallDiscount?: number | string | undefined,
        gst: number,
    }
) => {
    mrp = +(mrp || 0);
    qty = +(qty || 0);
    discount = +(discount || 0) + +(overallDiscount || 0);
    gst = +(gst || 0);
    const netItemAmount = (1 - discount / 100) * (mrp * qty);
    const gstAmount = netItemAmount - netItemAmount / (1 + gst / 100);
    return {
        itemAmount: mrp * qty,
        netItemAmount,
        gstAmount: gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
    };
}

export const calculateMarginPercent = (
    {
        effectivePTR,
        netItemAmount,
        billQty,
        looseEnabled,
        unitRatio
    }: {
        effectivePTR: number | undefined,
        netItemAmount: number,
        billQty: number | string,
        looseEnabled: boolean,
        unitRatio: number,
    }
) => {
    if (typeof effectivePTR === 'number') {
        effectivePTR = looseEnabled ? +effectivePTR / unitRatio : +effectivePTR;

        return +(+(((1 - (effectivePTR * +billQty) / netItemAmount) * 100) || 0)).toFixed(2);
    }
}

export const unitStockCount = (stock: number | string | undefined, unitRatio: number | string = 1): number => {
    if (!stock) {
        return (0);
    }

    if ((typeof stock === 'string') && stock.includes(':')) {
        const stockSplit = stock.split(':');

        const wholeQty = +(stockSplit[0] || '0');
        const looseQty = +(stockSplit[1] || '0');

        return (wholeQty * +(unitRatio) + looseQty);
    }

    return (+(stock) * +(unitRatio));
}

export const paymentModes = [
    {
        title: "Card",
        value: "Card"
    },
    {
        title: "Cash",
        value: "Cash"
    },
    {
        title: "UPI",
        value: "UPI"
    },
    {
        title: "Paytm",
        value: "Paytm"
    },
    {
        title: "RTGS/NEFT",
        value: "RTGS/NEFT"
    },
    {
        title: "Pending",
        value: "Pending"
    },
];