// optional code hai thoda bada hai 

// const asyncHandler = (fn) => {
//     return async (req, res, next) => { // Yahan async lagana padega
//         try {
//             await fn(req, res, next);
//         } catch (error) {
//             next(error);
//         }
//     };
// };


const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = asyncHandler;

