const isAlphanumeric = str => {
    const alphanumeric_regex = /^[a-z0-9]+$/i;
    return alphanumeric_regex.test(str);
}

const isValidReceipt = receipt => {
    // check the receipt object has the required properties
    if (!receipt.hasOwnProperty('retailer') ||
        !receipt.hasOwnProperty('purchaseDate') ||
        !receipt.hasOwnProperty('purchaseTime') ||
        !receipt.hasOwnProperty('items') ||
        !receipt.hasOwnProperty('total')
        ) return false;

    // for each of the required properties, check they meet their own requirements
    if (/[\w\s-]+$/.test(receipt.retailer) === false) {
        return false
    };
    if (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(receipt.purchaseDate) === false) {
        return false;
    }
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(receipt.purchaseTime) === false) {
        return false;
    }
    if (!(/^\d+\.\d{2}$/.test(receipt.total))) {
        return false;
    }

    // check the items array is the required length
    if (!(Array.isArray(receipt.items) && receipt.items.length > 0)) {
        return false;
    } else {
        // check each item in the array has the required properties
        for (const item of receipt.items) {
            if (!item.hasOwnProperty('shortDescription') || !item.hasOwnProperty('price')) return false;
            if (/^[\w\s-]+$/.test(item.shortDescription) === false) return false;
            if (/^\d+\.\d{2}$/.test(item.price) === false) return false;
        }
    }

    return true;
}

module.exports = {
    isAlphanumeric,
    isValidReceipt
}
