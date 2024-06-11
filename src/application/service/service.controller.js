import { getTranslationFunctions } from "../../utils/get-translations-locale.js";
import { logger } from "../../utils/logger.js";
import Service, { ACTIVE, INACTIVE } from "./service.model.js";
import { handleResponse } from "../../utils/handle-reponse.js";
import { StatusCodes } from "http-status-codes";
import { ServiceNotFound } from "./service.error.js";
import { cleanObject } from "../../utils/clean-object.js";

export const getAllServices = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start get all services");

    const { limit = 0, page = 0 } = req.query;

    const query = {
      tp_status: "ACTIVE",
    };

    const [total, services] = await Promise.all([
      Service.countDocuments(query),
      Service.find(query)
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(StatusCodes.OK).json({
      data: services,
      message: LL.SERVICE.CONTROLLER.MULTIPLE_RETRIEVED_SUCCESSFULLY(),
      total,
    });

    logger.info("Get all services successfully");
  } catch (error) {
    logger.error("Get all services controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};

export const createService = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start create service");

    const { name, description, price, currency } = req.body;
    // Create service
    const service = new Service({
      name,
      description,
      price,
      currency,
    });

    await service.save();

    res.status(StatusCodes.CREATED).json({
      data: service,
      message: LL.SERVICE.CONTROLLER.CREATED(),
    });

    logger.info("Service created successfully");
  } catch (error) {
    logger.error("Create service controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};

export const getServiceById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start get service by id");

    const { id } = req.params;

    const service = await Service.findOne({
      _id: id,
      tp_status: ACTIVE,
    });

    if (!service) {
      throw new ServiceNotFound(LL.SERVICE.ERROR.NOT_FOUND());
    }

    res.status(StatusCodes.OK).json({
      data: service,
      message: "Service retrieved successfully",
    });

    logger.info("Get service by id successfully");
  } catch (error) {
    logger.error("Get service by id controller error of type: ", error.name);
    handleResponse(res, error);
  }
};

export const updateService = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start update service");

    const { id } = req.params;
    const { name, description, price, currency } = req.body;

    const serviceUpdated = await Service.findOneAndUpdate(
      { _id: id, tp_status: ACTIVE },
      cleanObject({
        name,
        description,
        price,
        currency,
        updated_at: Date.now(),
      }),
      { new: true },
    );

    if (!serviceUpdated) {
      throw new ServiceNotFound(LL.SERVICE.ERROR.NOT_FOUND());
    }

    res.status(StatusCodes.OK).json({
      data: serviceUpdated,
      message: LL.SERVICE.CONTROLLER.UPDATED(),
    });

    logger.info("Update service successfully");
  } catch (error) {
    logger.error("Update service controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};

export const deleteServiceById = async (req, res) => {
  const LL = getTranslationFunctions(req.locale);
  try {
    logger.info("Start delete service by id");

    const { id } = req.params;

    const serviceDeleted = await Service.findOneAndUpdate(
      { _id: id, tp_status: ACTIVE },
      { tp_status: INACTIVE, updated_at: Date.now() },
      { new: true },
    );

    if (!serviceDeleted) {
      throw new ServiceNotFound(LL.SERVICE.ERROR.NOT_FOUND());
    }

    res.status(StatusCodes.OK).json({
      data: serviceDeleted,
      message: LL.SERVICE.CONTROLLER.DELETED(),
    });

    logger.info("Delete service by id successfully");
  } catch (error) {
    logger.error("Delete service by id controller error of type: ", error.name);
    handleResponse(res, error, LL);
  }
};
