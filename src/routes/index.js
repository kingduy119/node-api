import { Router } from "express";
import auth from "./auth";
// import user from "./user";
// import category from "./category";
// import product from "./product";

const apiRoute = Router();
module.exports = (app) => {
  apiRoute.use(auth);
  // apiRoute.use(user);
  // apiRoute.use(category);
  // apiRoute.use(product);

  app.get('/', (req, res, next) => { return res.send("Server is running!"); })
  app.use("/v1", apiRoute);
}
