import express from "express";
// Controllers
import { activate, addCustomer, ban, deactivate, deleteCustomer, editCustomer, getAllCustomers, getSingleCustomer } from "../controller/customers.controller.js";
import authorize from "../middlewares/authorize.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();


router.post("/addCustomer", addCustomer);
router.get("/getCustomers", authenticate,getAllCustomers);
router.patch("/edit/:id", authenticate,editCustomer)
router.get("/get/:id", getSingleCustomer);
router.patch("/deactivate/:id",authenticate,authorize('admin'), deactivate )
router.patch("/ban/:id",authenticate,authorize('admin'), ban )
router.patch("/activate/:id",authenticate,authorize('admin'), activate )
router.delete("/delete/:id", authenticate,authorize('admin'),deleteCustomer )

export default router;