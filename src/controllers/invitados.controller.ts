import { Request, Response } from "express";
import { create, findByPhone, getMany } from "../services/invitados.service";
import { Invitado } from "../types/invitados.interface";

// Crear nuevo invitado (para administración)
export const createInvitation = async  (req: Request, res: Response, next: Function) => {
  try {
    const { name, phone, maxGuests } = req.body;

    if (!name || !phone || !maxGuests) {
      return res.status(400).json({ 
        success: false, 
        message: "Todos los campos son requeridos" 
      });
    }

    if (maxGuests < 1 || maxGuests > 2) {
      return res.status(400).json({ 
        success: false, 
        message: "maxGuests debe ser 1 o 2" 
      });
    }

    const invitado = await create(name, phone, maxGuests);
    res.status(201).json({ success: true, invitado });
  } catch (error) {
    next(error);
  }
};

export const getAllInvitados = async  (_req: Request, res: Response, next: Function) => {
  try {
    const invitados = await getMany();
    res.json(invitados);
  } catch (error) {
    next(error);
  }
};

// Buscar invitado por nombre y teléfono
export const findInvitation = async  (req: Request, res: Response, next: Function) => {
  return await findByPhone(req, res, next)
};

//TODO: Refactorizar toda este mierda
/*
// Buscar invitado por nombre y teléfono
export const findInvitation = async  (req: Request, res: Response, next: Function) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Nombre y teléfono son requeridos" 
      });
    }

    const invitado: Invitado | null = await findByPhone(name, phone);

    if (!invitado) {
      return res.json({ 
        success: false, 
        message: "Invitado no encontrado. Verifica que el nombre y teléfono coincidan con tu invitación." 
      });
    }

    res.json({
      success: true,
      invitado: {
        name: invitado.name,
        phone: invitado.phone,
        maxGuests: invitado.maxGuests
      }
    });
  } catch (error) {
    next(error);
  }
};
*/