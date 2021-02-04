import { getJSDocReturnTag } from "typescript";

const optionalWithLength = (minlength: number, maxlength: number) => {
  const minLength = minlength || 0;
  const maxLength = maxlength || Infinity;
  return {
    validator: function (value) {
      if (value == undefined) true;
      return value.length >= minLength && value.length <= maxLength;
    },
    message:
      "Optional field is shorter than the minimum allowed length (" +
      minLength +
      ") or larger than the maximum allowed length (" +
      maxLength +
      ")",
  };
};

function requiredIf(field) {
  return [this.postType == field, `type of ${field} is required`];
}

export { optionalWithLength, requiredIf };
