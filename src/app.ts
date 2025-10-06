import  { Application, type Request, type Response } from 'express';
import express from 'express';

const app:Application = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from setup file');
});

export default app;