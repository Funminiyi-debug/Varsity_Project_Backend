"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
    StatusCode[StatusCode["BAD_DATA"] = 400] = "BAD_DATA";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["UNPROCESSED"] = 422] = "UNPROCESSED";
})(StatusCode || (StatusCode = {}));
function handleResponse(res, response) {
    switch (response.statusCode) {
        case StatusCode.OK:
            return res.status(response.statusCode).json({
                success: true,
                payload: response.data,
                message: response.message,
            });
        case StatusCode.NO_CONTENT:
            return res.status(response.statusCode).json({
                success: true,
                payload: response.data,
                message: response.message,
            });
        case StatusCode.CREATED:
            return res
                .header("Location", `${res.locals.url}/${response.data._id}`)
                .status(response.statusCode)
                .json({
                success: true,
                payload: response.data,
                message: response.message,
            });
        default:
            return res.status(response.statusCode).json({
                success: false,
                payload: response.data,
                message: response.message,
            });
    }
    // if (response.message == undefined) {
    //   res
    //     .status(response.statusCode)
    //     .json({ success: true, payload: response.data });
    // } else {
    //   res
    //     .status(response.statusCode)
    //     .json({ success: false, message: response.message });
    // }
}
exports.handleResponse = handleResponse;
//# sourceMappingURL=handleResponse.js.map