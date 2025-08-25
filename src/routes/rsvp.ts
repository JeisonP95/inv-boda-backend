import { Router } from "express";
import { crearRSVP, listarRSVPs } from "../controllers/rsvp.controller";
const router = Router();

router
  .post("/", crearRSVP)
  .get("/", listarRSVPs);

export default router;
