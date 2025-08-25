import { RSVPModel } from "../models/RSVP";

export const save = async (
    name: string, 
    phone: string, 
    attending: boolean, 
    guests: number
) => {
  const rsvp = new RSVPModel({ name, phone, attending, guests });
  return await rsvp.save();
};

// Listar RSVPs
export const getMany = async () => {
    const list = await RSVPModel.find();
    return list;
};
