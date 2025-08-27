// const asyncHandler = (fn) => {
//   () => {};
// };

//USED IN PRODUCTION.
const asyncHandler = (requestHandler) => {
  async (req, res, next) => {
    Promise.resolve(await requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export { asyncHandler };

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (err) {
//     res.status(err.code || 500).json({
//       message: err.message,
//       success: false,
//     });
//   }
// };
