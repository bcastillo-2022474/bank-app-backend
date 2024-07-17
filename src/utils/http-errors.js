import { StatusCodes } from "http-status-codes";
export const getErrorFromErrors = (error, errors) => {
  let errorClassFound;
  const found = errors.find((err) => {
    const errorClass = err.classes.find(
      (clazz) => Object.getPrototypeOf(error).constructor.name === clazz.name,
    );

    if (errorClass) {
      errorClassFound = errorClass;
      return true;
    }

    return false;
  });

  return {
    code: found?.code || StatusCodes.INTERNAL_SERVER_ERROR,
    type: (errorClassFound ?? { name: "Fatal" }).name,
    stack: error.stack,
    message: found?.message,
  };
};
