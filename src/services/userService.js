import { generateToken } from "../configs/generateToken.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Criação do transportador de e-mail
const transponder = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_PASS,
    },
});

// Função para enviar e-mail
const sendResetEmail = async (email, token) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Redefinição de Senha',
        text: `Clique no link abaixo para redefinir sua senha:\n\nhttps://rxcampanhas.vercel.app/reset-password/${token}`,
    };

    try {
        await transponder.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Erro ao enviar e-mail: ' + error.message);
    }
};

export const createUser = async (userData) => {
    const { nome, email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Usuário já registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ nome, email, password: hashedPassword });

    await newUser.save();

    const token = await generateToken(newUser);
    await sendResetEmail(newUser.email, token);  // Envia o e-mail de confirmação

    return { user: newUser, token };
};

export const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
    }

    const token = await generateToken(user);
    return { userId: user._id, userNome: user.nome, isAdmin: user.isAdmin, token, tokenExpiration: 1 };
};

// Função para gerar um token de redefinição de senha
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Função para iniciar o processo de redefinição de senha
export const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expira em 1 hora
    await user.save();

    await sendResetEmail(email, resetToken);
    return { message: 'E-mail de recuperação enviado' };
};

// Função para redefinir a senha
export const resetPassword = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error('Token de redefinição inválido ou expirado');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Senha redefinida com sucesso' };
};
