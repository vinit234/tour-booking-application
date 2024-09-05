import Booking from '../models/Booking.js';
import { verifyToken } from '../utils/verifyToken.js';

export const createBooking = async (req, res) => {
  verifyToken(req, res, async () => {
    const newBooking = new Booking({ ...req.body, userId: req.user.id });

    try {
      const savedBooking = await newBooking.save();
      res.status(200).json({ success: true, message: "Your tour is booked!", data: savedBooking });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error!" });
    }
  });
};
export const getBooking = async (req, res) => {
  verifyToken(req, res, async () => {
    const id = req.params.id;

    try {
      const booking = await Booking.findById(id);

      if (booking && booking.userId === req.user.id) {
        res.status(200).json({ success: true, message: "Successful!", data: booking });
      } else {
        res.status(404).json({ success: false, message: "Booking not found or unauthorized access!" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error!" });
    }
  });
};

// Get all bookings for the authenticated user
export const getAllBooking = async (req, res) => {
  verifyToken(req, res, async () => {
    try {
      const bookings = await Booking.find({ userId: req.user.id });
      res.status(200).json({ success: true, message: "Successful!", data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error!" });
    }
  });
};
