import express from "express";
import Supplier from "#models/supplier.model";
// import art from "#controllers/supplier.controller";
import base from "#controllers/_base.controller";
import verifyTokenJWT from "../middleware/authJwt.js";
const routerSupplier = express.Router();

//#region SUPPLIERS
// GET: api/supplier/getbypageno
routerSupplier
  .route("/getbypageno/:pageno&:pagesize&:query")
  .get(verifyTokenJWT, (req, res) => {
    base.GET_BY_PAGING(req, res, Supplier);
  });

  // POST: api/supplier/insertnew
routerSupplier.route("/insertnew").post(verifyTokenJWT, (req, res) => {
  base.INSERT(req, res, Supplier);
});

// PUT: api/supplier/update
routerSupplier.route("/update").put(verifyTokenJWT, (req, res) => {
  base.UPDATE(req, res, Supplier);
});

// DELETE: api/supplier/delete
routerSupplier.route("/delete/:ids").delete(verifyTokenJWT, (req, res) => {
  base.DELETE(req, res, Supplier);
});
//#endregion

export default routerSupplier;
