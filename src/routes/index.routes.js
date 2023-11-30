import { Router } from "express";
import CalcularReserva from "../controller/CalcularReserva.js";
const router = Router();
router.post("/calcular",CalcularReserva.recolectar_Json)


export default router;
