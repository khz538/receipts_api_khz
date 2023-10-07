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

    // for each of the required properties, check they meet their own formatting requirements
    if (/[\w\s-]+$/.test(receipt.retailer) === false) {
        return false
    };
    if (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(receipt.purchaseDate) === false) {
        return false;
    }
    if (!isValidDate(receipt.purchaseDate)) return false;
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

function isValidDate(dateString) {
    // dateString comes in format YYYY-MM-DD
    // parse the string into year, month, day
    const [month, day, year] = [parseInt(dateString.slice(5, 7)), parseInt(dateString.slice(8)), parseInt(dateString.slice(0, 4))];
    const isLeapYear = yearString => {
        const year = parseInt(yearString);
        // leap years are divisible by 4, but not by 100 unless also by 400
        if (year % 4 === 0) {
            if (year % 100 === 0) {
                if (year % 400 === 0) return true;
                else return false;
            } else return true;
        } else return false;
    }

    // the date cannot be in the future
    const isInFuture = (year, month, day) => {
        // ensure the date on the receipt is not in the future
        const now = new Date();
        if (year > now.getFullYear()) return true;
        else if (year < now.getFullYear()) return false;
        // check the month is not in the future
        if (month > now.getMonth() + 1) return true;
        else if (month < now.getMonth() + 1) return false;
        // check the day is not in the future
        if (day > now.getDate()) return true;
        else return false;
    }

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (month === 2) {
        if (isLeapYear(year)) {
            if (day > 29) return false;
        } else {
            if (day > 28) return false;
        }
    }
    if ([4, 6, 9, 11].includes(month)) {
        if (day > 30) return false;
    }

    return isInFuture(year, month, day) === false
}



module.exports = {
    isAlphanumeric,
    isValidReceipt,
}
