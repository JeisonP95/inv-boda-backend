import { Router } from "express";
import { createInvitation, findInvitation, getAllInvitados } from "../controllers/invitados.controller";

const router = Router();
router
  .post("/find", findInvitation)
  .post("/", createInvitation)
  .get("/", getAllInvitados);

export default router;
