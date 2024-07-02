import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import oEnvironment from './constants/Environment';
import { routes } from './routes/Routes'; // Asumiendo que 'Routes' exporta 'routes'

const app: Express = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'authorization'],
  })
);
app.use(bodyParser.json());

if (oEnvironment.DEBUG) {
  app.use(morgan('dev'));
}

app.listen(oEnvironment.PORT, () =>
  console.log(`Server started, listening port: ${oEnvironment.PORT}`)
);

routes(app); // Aquí usamos 'routes' en lugar de 'oRoutes'
