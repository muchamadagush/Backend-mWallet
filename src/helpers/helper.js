exports.responsePagination = (
    res,
    statusCode,
    message,
    totalData,
    totalPage,
    currentPage,
    perPage,
    data
) => {
    res.status(statusCode).json({
        status: statusCode === 200,
        message,
        meta: {
            totalData,
            totalPage,
            currentPage,
            perPage
        },
        data
    });
};

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