import { Router } from "express";
import { RSVPModel } from "../models/RSVP";

const router = Router();

// Crear RSVP
router.post("/", async (req, res, next) => {
  try {
    const { name, phone, attending, guests } = req.body;

    if (!name || !phone || typeof attending !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "Campos incompletos o inválidos" });
    }

    // 👇 Aseguramos que guests siempre tenga un valor válido
    const guestsCount = attending ? guests ?? 0 : 0;

    const rsvp = new RSVPModel({
      name,
      phone,
      attending,
      guests: guestsCount,
    });

    await rsvp.save();

    res.status(201).json({
      success: true,
      message: "✅ Confirmación guardada con éxito",
      rsvp,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
