import express from "express";
import { getOrganizations } from "../controllers/organizationController";

const router=express.Router();

router.get('/get-organizations',getOrganizations);

export default router;
