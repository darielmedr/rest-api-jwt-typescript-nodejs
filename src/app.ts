import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';

import passportMiddleware from './middlewares/passport';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';

/**
 * Initializations
 */
const app = express();

/**
 * Settings
 */
app.set('port', process.env.PORT || 3000);

/**
 * Middlewares
 */
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

/**
 * Routes
 */
app.get('/', (req: Request, res: Response) => {
    res.send(`API is at http://localhost:${app.get('port')}`);
});

app.use('/auth', authRoutes);
app.use('/admin', passport.authenticate('jwt', { session: false }), adminRoutes);

export default app;