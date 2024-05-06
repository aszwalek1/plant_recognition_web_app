/**
 * Converts a colour from a hexadecimal string to a list of its rgb values
 * @param colour the colour as a hexadecimal string
 * @returns {number[]} the colour as a list of its rgb values
 */
function colourStringToNums(colour) {
    return [
        Number("0x" + colour.substring(1, 3)), // red,
        Number("0x" + colour.substring(3, 5)), // green,
        Number("0x" + colour.substring(5, 7)) // blue
    ];
}

exports.colourStringToNums = colourStringToNums
