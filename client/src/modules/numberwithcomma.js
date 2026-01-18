function numberWithCommas(x) {
    // Convert the number to a string
    let parts = x.toString().split(".");
    // Use regex to add commas to the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Join the integer and decimal parts back together
    return parts.join(".");
}

export default numberWithCommas