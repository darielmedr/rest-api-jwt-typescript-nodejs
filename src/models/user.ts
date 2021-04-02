import { model, Schema, Document } from 'mongoose';
import bcrytp from 'bcrypt';

export interface User extends Document {
    email: string,
    password: string,
    comparePassword: (password: string) => Promise<boolean>
}

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.pre<User>('save', async function (next) {
    const user: User = this as User;

    if (!user.isModified('password')) return next();

    // New User
    const salt = await bcrytp.genSalt(10);
    const hash = await bcrytp.hash(user.password, salt);
    user.password = hash;
    next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const user: User = this as User;

    return bcrytp.compare(password, user.password);
}

export default model<User>('UserModel', UserSchema);