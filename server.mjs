import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';

import routes from './controllers/routes.mjs';
import config from './models/config.mjs';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
});

const Server = class Server {
  constructor() {
    this.app = express();
    this.config = config[process.argv[2]] || config.developement;
  }

  async dbConnect() {
    try {
      const host = this.config.mongodb;

      this.connect = await mongoose.createConnection(host);
      console.log(`Connecté`);

      const close = () => {
        this.connect.close((error) => {
          if (error) {
            console.error('[ERROR] api dbConnect() close() -> mongodb error', error);
          } else {
            console.log('[CLOSE] api dbConnect() close() -> mongodb closed');
          }
        });
      };

      this.connect.on('error', (err) => {
        setTimeout(() => {
          console.log('[ERROR] api dbConnect() -> mongodb error', err);
          this.connect = this.dbConnect();
        }, 5000);
      });

      this.connect.on('disconnected', () => {
        setTimeout(() => {
          console.log('[ERROR] api dbConnect() -> mongodb disconnected');
          this.connect = this.dbConnect();
        }, 5000);
      });

      process.on('SIGINT', () => {
        close();
        process.exit(0);
      });
    } catch (err) {
      console.error(`[ERROR] api dbConnect() -> ${err}`);
    }
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(limiter);
  }

  routes() {
    new routes.Users(this.app, this.connect);
    new routes.Groups(this.app, this.connect);
    new routes.Events(this.app, this.connect);
    new routes.Discussions(this.app, this.connect);
    new routes.Albums(this.app, this.connect);
    new routes.Polls(this.app, this.connect);
    new routes.Tickets(this.app, this.connect);

    this.app.use((req, res) => {
      res.status(404).json({
        code: 404,
        message: 'Not Found'
      });
    });
  }

  async run() {
    try {
      await this.dbConnect();
      this.middleware();
      this.routes();
      this.app.listen(this.config.port, () => {
        console.log(`Serveur lancé sur la port ${this.config.port}`);
      });
    } catch (err) {
      console.log(err);
    }
  }
};

const server = new Server();
server.run();

export default Server;