import express from "express";

export default (schemaId, schemaBody) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let validation: any;
    let error = { details: undefined };
    if (req.method == "POST") {
      try {
        validation = await schemaBody.validateAsync(req.body);
      } catch (err) {
        error.details = err;
      }
    }
    if (req.method == "PUT") {
      try {
        if (req.body.id != req.params.id) {
          return res.status(422).json({
            error: "ensure id in params is consistent with entity id",
          });
        }
        validation = await schemaId.validateAsync(req.params.id);
      } catch (err) {
        error.details = err;
      }
    }

    let valid = error.details == undefined;

    if (valid) {
      next();
      return;
    } else {
      const { details } = error;
      return res.status(422).json({ error: details });
    }
  };
};
