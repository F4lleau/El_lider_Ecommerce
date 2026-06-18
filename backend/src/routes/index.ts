import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";
import { adminCategoriesRouter, categoriesRouter } from "../modules/categories/categories.routes.js";
import { adminProductsRouter, productsRouter } from "../modules/products/products.routes.js";
import { cartRouter } from "../modules/cart/cart.routes.js";
import { adminOrdersRouter, checkoutRouter, meOrdersRouter, ordersRouter } from "../modules/orders/orders.routes.js";
import { siteContentRouter } from "../modules/site-content/site-content.routes.js";
import { stockRequestsRouter } from "../modules/stock-requests/stock-requests.routes.js";
import { orderPaymentsRouter, paymentsRouter } from "../modules/payments/payments.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/admin/products", adminProductsRouter);
apiRouter.use("/admin/categories", adminCategoriesRouter);
apiRouter.use(stockRequestsRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/orders", orderPaymentsRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/checkout", checkoutRouter);
apiRouter.use("/me/orders", meOrdersRouter);
apiRouter.use("/admin/orders", adminOrdersRouter);
apiRouter.use("/site-content", siteContentRouter);

export { apiRouter };
