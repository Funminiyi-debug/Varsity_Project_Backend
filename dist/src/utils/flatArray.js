//@ts-nocheck
if (!Array.prototype.flat) {
    Array.prototype.flat = function (maxDepth, currentDepth) {
        "use strict";
        var array = this;
        maxDepth =
            maxDepth === Infinity
                ? Number.MAX_SAFE_INTEGER
                : parseInt(maxDepth, 10) || 1;
        currentDepth = parseInt(currentDepth, 10) || 0;
        // It's not an array or it's an empty array, return the object.
        if (!Array.isArray(array) || !array.length) {
            return array;
        }
        // If the first element is itself an array and we're not at maxDepth,
        // flatten it with a recursive call first.
        // If the first element is not an array, an array with just that element IS the
        // flattened representation.
        // **Edge case**: If the first element is an empty element/an "array hole", skip it.
        // (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#Examples)
        var firstElemFlattened = Array.isArray(array[0]) && currentDepth < maxDepth
            ? array[0].flat(maxDepth, currentDepth + 1)
            : array[0] === undefined
                ? []
                : [array[0]];
        return firstElemFlattened.concat(array.slice(1).flat(maxDepth, currentDepth));
    };
}
//# sourceMappingURL=flatArray.js.map