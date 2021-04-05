import { Request, Response } from "express";
import UserModel, { User } from "../models/user";
import jwt, { SignOptions } from 'jsonwebtoken';

import config from '../config/config';
import SessionData from '../models/session-data';

class UserController {

    constructor() { }

    public async singUp(req: Request, res: Response): Promise<Response> {
        const user: User = req.body as User;
        if (!user.password || !user.email) {
            return res.status(400).json({
                message: "Error. User's credentials are missing."
            });
        }

        const storedUser = await UserModel.findOne({ email: user.email });
        if (storedUser) {
            return res.status(400).json({
                message: `User with email <${storedUser.email}> already exists.`
            });
        }

        const newUser = new UserModel(user);
        await newUser.save();

        return res.status(201).json(newUser);
    }

    public async singIn(req: Request, res: Response): Promise<any> {
        try {
            const user: User = req.body as User;

            if (!user.password || !user.email) {
                return res.status(400).json({
                    message: "Error. User's credentials are missing."
                });
            }

            const storedUser = await UserModel.findOne({ email: user.email });
            if (!storedUser) {
                return res.status(400).json({
                    message: `User with email <${user.email}> doesn't exists.`
                });
            }

            const isPasswordValid: boolean = await storedUser.comparePassword(user.password);
            if (isPasswordValid) {
                const jwtOptions: SignOptions = {
                    expiresIn: config.JWT.expiresIn
                };
                const token: string = jwt.sign({ id: storedUser.id, email: storedUser.email }, config.JWT.jwtSecret, jwtOptions);
                const sessionData: SessionData = {
                    idToken: token,
                    expiresIn: config.JWT.expiresIn
                };
                return res.status(200).json(sessionData);
            }

            return res.status(400).json({
                message: 'The email or password are incorrect.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error
            });
        }
    }
}

const userController = new UserController();
export default userController;