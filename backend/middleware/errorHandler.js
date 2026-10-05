const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  // body-parser / validator errors already carry the correct status (e.g. 400 for malformed JSON)
  const statusCode = err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  // A 5xx means *we* broke, so in production the cause stays in the log and the
  // visitor gets a neutral message. Returning raw err.message here used to leak
  // Mongo URIs, collection names and file paths to anyone who could trigger an
  // error. 4xx messages are our own validation text and are always safe to show.
  const isServerFault = statusCode >= 500;
  const exposeDetail = !isServerFault || process.env.NODE_ENV !== 'production';

  res.status(statusCode).json({
    message: exposeDetail ? err.message : 'Something went wrong on our side. Please try again.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { errorHandler };