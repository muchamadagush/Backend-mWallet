exports.responsePagination = (
    res,
    statusCode,
    message,
    totalData,
    totalPage,
    data,
    currentPage,
    perPage
) => {
    res.status(statusCode).json({
        status: statusCode === 200,
        message,
        totalData,
        totalPage,
        data,
        currentPage,
        perPage,
    });
};

// (exports.responsePaginationDetail = (res, rescode, message, pagination, arr) => {
//     res.json({
//         code: rescode,
//         msg: message,
//         pagination,
//         data: arr,
//     });
// }),
    (exports.responseSuccess = (res, statusCode, message, data) => {
        res.status(statusCode).json({
            status: statusCode === 200,
            message,
            data,
        });
    });

exports.responseError = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: statusCode === 200,
        message,
    });
};