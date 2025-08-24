"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSVPModel = void 0;
const mongoose_1 = require("mongoose");
const rsvpSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    attending: { type: Boolean, required: true },
});
exports.RSVPModel = (0, mongoose_1.model)("RSVP", rsvpSchema);
//# sourceMappingURL=RSVP.js.map