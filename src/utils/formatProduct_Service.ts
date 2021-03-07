const formatProduct_Service = (db) => {
  let payload = db;
  if (Array.isArray(payload)) {
    payload = payload.map((element) => {
      element = element.toObject();
      if (element.otherFields != undefined) {
        const { otherFields } = element;
        otherFields.forEach((item) => {
          Object.keys(item).forEach((v) => {
            element[v] = item[v];
          });
        });
        delete element.otherFields;
        return element;
      }
    });

    return payload;
  } else {
    payload = payload.toObject();
    if (payload.otherFields != undefined) {
      const { otherFields } = payload;
      otherFields.forEach((item) => {
        Object.keys(item).forEach((v) => {
          payload[v] = item[v];
        });
      });
    }
    delete payload.otherFields;
  }
  console.log("final value returned is", payload);
  return payload;
};
export default formatProduct_Service;
