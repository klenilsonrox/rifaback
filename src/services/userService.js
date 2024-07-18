import { generateToken } from "../configs/generateToken.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs"


export const createUser = async (userData) => {
    const { nome, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Usuário já registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ nome, email, password: hashedPassword });

    await newUser.save();

    const token =await generateToken(newUser)

    return { user: newUser, token};
};


export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('credenciais inválidas');
    }

    const token =await generateToken(user)

    return { userId: user._id, userNome:user.nome, isAdmin:user.isAdmin, token, tokenExpiration: 1 };
};



