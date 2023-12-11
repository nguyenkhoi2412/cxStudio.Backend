import express from "express";
import customer from "#controllers/customer.controller";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerCustomer = express.Router();

//#region CUSTOMERS
// GET: api/customers
routerCustomer.route("/:pageindex&:pagesize").get(verifyTokenJWT, customer.GET_CUSTOMERS);

// GET: api/users/id
// routerCustomer.route("/:id").get(user.GET_USER_BY_ID);
//#endregion

export default routerCustomer;
