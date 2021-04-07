import { Request, Response } from "express";
import UserModel, { User } from "../models/user";
import jwt, { SignOptions } from 'jsonwebtoken';

import config from '../config/config';
import SessionData from '../models/session-data';
import emailSender from "../helpers/email-sender";
import PasswordResetEmailData from "../models/password-reset-email-data";
import EmailResponse from "../models/email-response";

class UserController {

    constructor() { }

    public async singUp(req: Request, res: Response): Promise<Response> {
        try {
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
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: error
            });
        }
    }

    public async singIn(req: Request, res: Response): Promise<Response> {
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
                    expiresIn: config.JWT.EXPIRES_IN_TOKEN
                };
                const token: string = jwt.sign({ id: storedUser.id, email: storedUser.email }, config.JWT.JWT_SECRET, jwtOptions);
                const sessionData: SessionData = {
                    idToken: token,
                    expiresIn: config.JWT.EXPIRES_IN_TOKEN
                };
                return res.status(200).json(sessionData);
            }

            return res.status(400).json({
                message: 'The email or password are incorrect.'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: error
            });
        }
    }

    public async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    message: `User with email <${email}> doesn't exists.`
                });
            }

            const jwtOptions: SignOptions = {
                expiresIn: config.JWT.EXPIRES_IN_LINK
            };
            const token: string = jwt.sign({ id: user.id, email: user.email }, config.JWT.JWT_RESEST_PASSWORD_SECRET, jwtOptions);

            // save the reset password token on the User property <resetTokenLink>
            user.resetTokenLink = token;
            await user.save();

            const passwordResetEmailData: PasswordResetEmailData = {
                userEmail: user.email,
                token: token
            };
            const emailResponse: EmailResponse = await emailSender.sendPasswordResetEmail(passwordResetEmailData);

            if (!emailResponse.success) {
                return res.status(400).json(emailResponse);
            }
            return res.status(200).json({
                message: `Email has been sent to <${user.email}>. Please follow the instructions.`
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: error
            });
        }
    }

    public async changePassword(req: Request, res: Response): Promise<Response> {
        try {
            const { resetToken, newPassword } = req.body;

            if (!resetToken) {
                return res.status(401).json({
                    message: 'Authentication error.'
                });
            }

            // throw an error in case resetToken is invalid or expired
            jwt.verify(resetToken, config.JWT.JWT_RESEST_PASSWORD_SECRET);

            const user = await UserModel.findOne({ resetTokenLink: resetToken });
            if (!user) {
                return res.status(400).json({
                    message: 'User with this token does not exist.'
                });
            }
            user.password = newPassword;
            await user.save();

            return res.status(200).json({
                message: 'Password was changed successfully.'
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: error
            });
        }
    }
}

const userController = new UserController();
export default userController;