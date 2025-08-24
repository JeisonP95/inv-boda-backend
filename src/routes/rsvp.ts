import { Router } from "express";
import { RSVPModel } from "../models/RSVP";

const router = Router();

// Crear RSVP
router.post("/", async (req, res, next) => {
  try {
    const { name, phone, attending, guests } = req.body;

    if (!name || !phone || typeof attending !== "boolean") {
      return res.status(400).json({ success: false, message: "Campos incompletos o inválidos" });
    }

    // Si va a asistir, guests es requerido
    if (attending && (!guests || guests < 1 || guests > 2)) {
      return res.status(400).json({ 
        success: false, 
        message: "Si vas a asistir, debes especificar el número de personas (1 o 2)" 
      });
    }

    const rsvp = new RSVPModel({ name, phone, attending, guests });
    await rsvp.save();

    res.status(201).json({ success: true, rsvp });
  } catch (error) {
    next(error);
  }
});

// Listar RSVPs
router.get("/", async (req, res, next) => {
  try {
    const list = await RSVPModel.find();
    res.json(list);
  } catch (error) {
    next(error);
  }
});

export default router;
