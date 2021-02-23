import express from "express";

export default (schemaId, schemaBody) => {
  return (req: express.Request, res: express.Response, next) => {
    let validation: any;
    switch (req.method) {
      case "put":
        validation = schemaId.validate(req.params.id);
        break;

      case "post":
        validation = schemaBody.validate(req.params.id);
        break;

      default:
        break;
    }

    let { error } = validation;

    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      console.log("error", message);
      res.status(422).json({ error: message });
    }
  };
};
