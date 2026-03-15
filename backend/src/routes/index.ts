import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";
import { categoriesRouter } from "../modules/categories/categories.routes.js";
import { productsRouter } from "../modules/products/products.routes.js";
import { cartRouter } from "../modules/cart/cart.routes.js";
import { ordersRouter } from "../modules/orders/orders.routes.js";
import { site_contentRouter } from "../modules/site-content/site-content.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/site-content", site_contentRouter);

export { apiRouter };
