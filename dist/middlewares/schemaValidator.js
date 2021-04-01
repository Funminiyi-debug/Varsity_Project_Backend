"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (schemaId, schemaBody) => {
    return async (req, res, next) => {
        let validation;
        let error = { details: undefined };
        if (req.method == "POST") {
            try {
                validation = await schemaBody.validateAsync(req.body);
            }
            catch (err) {
                error.details = err;
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", err);
            }
        }
        if (req.method == "PUT") {
            try {
                if (req.body.id !== req.params.id) {
                    console.log("from body", req.body);
                    console.log("from params", req.params);
                    return res.status(422).json({
                        error: "ensure id in params is consistent with entity id",
                    });
                }
                validation = await schemaId.validateAsync(req.params.id);
            }
            catch (err) {
                error.details = err;
            }
        }
        let valid = error.details == undefined;
        if (valid) {
            next();
            return;
        }
        else {
            const { details } = error;
            return res.status(422).json({ error: details });
        }
    };
};
//# sourceMappingURL=schemaValidator.js.map