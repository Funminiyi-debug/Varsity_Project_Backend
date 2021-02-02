export default function handleResponse(res, results) {
  const { statusCode, data, message } = results;
  console.log(data);
  let isError = false;
  let newMessage = "";

  switch (statusCode) {
    case 200:
      204;
      break;
    case 400:
      isError = true;
      newMessage = message || "Bad Request";
      break;
    case 401:
      isError = true;
      newMessage = message || "Authorization Required";
      break;
    case 403:
      isError = true;
      newMessage = message || "Access to this resource is denied.";
      break;
    case 404:
      isError = true;
      newMessage = message || "Not found.";
      break;
    case 500:
      isError = true;
      newMessage = message || "Internal Server Error.";
      break;
    case 503:
      isError = true;
      newMessage = message || "Service Unavailable.";
      break;
    default:
      break;
  }

  const resObj = {
    error: false,
    message: "",
    data: [],
    statusCode: 0,
  };

  resObj.data = data;

  if (isError) {
    resObj.error = isError;
    resObj.message = newMessage;
  } else {
    delete resObj.error;
    delete resObj.message;
  }

  resObj.statusCode = statusCode;
  return res.json(resObj);
}
