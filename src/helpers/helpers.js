const response = (res, message, result, status, error) => {
  const resultPrint = {};
  resultPrint.status = status || 200;
  resultPrint.message = message || null;
  resultPrint.data = result;
  resultPrint.error = error || null;
  res.status(status).json(resultPrint);
};

module.exports = {
  response,
};
