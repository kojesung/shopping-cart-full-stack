import express from 'express';
import cors from 'cors';
import productRouter from './routes/productsRoutes';
import cartItemsRouter from './routes/cartItemsRoute';
import orderCheckRouter from './routes/orderCheckRoute';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(cors());

app.use(express.json());

app.use('', productRouter);
app.use('', cartItemsRouter);
app.use('', orderCheckRouter);

app.use(errorHandler);

export default app;
