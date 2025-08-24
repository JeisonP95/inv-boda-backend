import { Document } from "mongoose";
export interface IRSVP extends Document {
    name: string;
    phone: string;
    attending: boolean;
}
export declare const RSVPModel: import("mongoose").Model<IRSVP, {}, {}, {}, Document<unknown, {}, IRSVP, {}, {}> & IRSVP & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=RSVP.d.ts.map