import { Schema, model, Document } from "mongoose";

export interface IInvitado extends Document {
  name: string;
  phone: string;
  maxGuests: number; // 1 = solo él/ella, 2 = él/ella + 1 acompañante
}

const invitadoSchema = new Schema<IInvitado>({
  name: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  maxGuests: { type: Number, required: true, min: 1, max: 2 }
});

export const InvitadoModel = model<IInvitado>("Invitado", invitadoSchema);
