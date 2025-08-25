import { Request, Response } from "express";
import { getMany, save } from "../services/rsvp.service";

export const crearRSVP = async (req: Request, res: Response, next: Function) => {
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

    const rsvp = await save(name, phone, attending, guests);
    res.status(201).json({ success: true, rsvp });
  } catch (error) {
    next(error);
  }
};

// Listar RSVPs
export const listarRSVPs = async (_req: Request, res: Response, next: Function) => {
  try {
    const list = await getMany();
    res.json(list);
  } catch (error) {
    next(error);
  }
};
