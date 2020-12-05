import { app } from './app';

require('dotenv').config();

const start = async () => {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
};

start();
