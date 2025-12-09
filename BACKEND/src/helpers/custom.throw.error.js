const CustomThrowError = (message, statucCode) => {
    const error = new Error(message);
    error.statucCode = statucCode;
    return error;
}

export default CustomThrowError;