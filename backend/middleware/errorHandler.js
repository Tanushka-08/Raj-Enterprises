const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // body-parser / validator errors already carry the correct status (e.g. 400 for malformed JSON)
  const statusCode = err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
