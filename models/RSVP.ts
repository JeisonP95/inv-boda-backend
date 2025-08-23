import { Schema, model, Document } from "mongoose";

export interface IRSVP extends Document {
  name: string;
  phone: string;
  attending: boolean;
}

const rsvpSchema = new Schema<IRSVP>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  attending: { type: Boolean, required: true },
});

export const RSVPModel = model<IRSVP>("RSVP", rsvpSchema);
