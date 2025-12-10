const CustomThrowError = (field, message, statucCode) => {
    const error = new Error(message);
    error.statucCode = statucCode;
    error.field = field
    return error;
}

export default CustomThrowError;