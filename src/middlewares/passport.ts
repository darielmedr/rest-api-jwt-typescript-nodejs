import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import config from "../config/config";
import UserModel from '../models/user';


const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT.JWT_SECRET
};

export default new Strategy(options, async (payload, done) => {
    try {
        const user = await UserModel.findById(payload.id);

        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        console.error(error);
    }
});