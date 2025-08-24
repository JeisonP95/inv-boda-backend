import { Schema, model, Document } from "mongoose";

export interface IRSVP extends Document {
  name: string;
  phone: string;
  attending: boolean;
  guests?: number; // Número de personas que asistirán
}

const rsvpSchema = new Schema<IRSVP>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  attending: { type: Boolean, required: true },
  guests: { type: Number, min: 1, max: 2 }
});

export const RSVPModel = model<IRSVP>("RSVP", rsvpSchema);
