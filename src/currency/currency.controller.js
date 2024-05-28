import { response } from "express";
import Currency from "../../src/currency/currency.model.js";
import { getTranslationFunctions } from "../utils/get-translations-locale.js";

export const currencyGet = async (req, res = response) => {
  const locale = req.headers["accept-language"] || "en";
  const LL = getTranslationFunctions(locale);
  try {
    const { limit, page } = req.query;

    const [total, currency] = await Promise.all([
      Currency.countDocuments(),
      Currency.find()
        .limit(limit)
        .skip(limit * page),
    ]);

    res.status(200).json({ message: LL.HI(), data: currency, total });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error", error });
  }
};

export const putRoom = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { description, people_capacity, night_price, room_type } = req.body;
    const roomToUpdate = {
      description,
      people_capacity,
      night_price,
      room_type,
      updated_at: new Date(),
    };
    Object.keys(roomToUpdate).forEach((key) => {
      try {
        if (roomToUpdate[key] === undefined) {
          delete roomToUpdate[key];
        }
      } catch (error) {}
    });
    const updatedRoom = await RoomModel.findByIdAndUpdate(id, roomToUpdate, {
      new: true,
    });
    if (!updatedRoom) {
      return res.status(404).json({
        msg: "Room not found",
      });
    }

    res.status(200).json({
      msg: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {}
};

export const roomDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findByIdAndUpdate(
      id,
      { tp_status: "INACTIVE" },
      { new: true },
    );
    if (!room) {
      return res.status(404).json({
        msg: "Room not found",
      });
    }

    res.status(200).json({
      msg: "Room deleted successfully",
      room,
    });
  } catch (error) {}
};

export const roomPost = async (req, res) => {
  try {
    const { description, people_capacity, night_price, room_type, hotel } =
      req.body;
    const room = new RoomModel({
      description,
      people_capacity,
      night_price,
      room_type,
      hotel,
    });
    await room.save();
    res.status(201).json({
      room,
    });
  } catch (error) {}
};
