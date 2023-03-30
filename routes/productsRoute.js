import express from "express";
import {
  addNewProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productsController.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// get request "/products"
router.get("/", getAllProducts);

// post request "/products"
router.post("/", auth, isAdmin, addNewProduct);

router.patch("/:id", auth, isAdmin, updateProduct);

// patch request  "/products/757575757577575755"
router.get("/:id", getSingleProduct);

//delete request ("/products/342847283748274827482")
router.delete("/:id", auth, isAdmin, deleteProduct);

export default router;
