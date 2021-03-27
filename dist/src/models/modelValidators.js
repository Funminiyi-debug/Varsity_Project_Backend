"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalWithLength = void 0;
const optionalWithLength = (minlength, maxlength) => {
    const minLength = minlength || 0;
    const maxLength = maxlength || Infinity;
    return {
        validator: function (value) {
            if (value == undefined)
                true;
            return value.length >= minLength && value.length <= maxLength;
        },
        message: "Optional field is shorter than the minimum allowed length (" +
            minLength +
            ") or larger than the maximum allowed length (" +
            maxLength +
            ")",
    };
};
exports.optionalWithLength = optionalWithLength;
//# sourceMappingURL=modelValidators.js.map