import { Schema, model, Document } from "mongoose";

export interface IRSVP extends Document {
  name: string;
  phone: string;
  attending: boolean;
  guests?: number;
  
}

const rsvpSchema = new Schema<IRSVP>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  attending: { type: Boolean, required: true },
  guests: { type: Number, default: 0 },
});

export const RSVPModel = model<IRSVP>("RSVP", rsvpSchema);
