// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    numeros_comprados: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false } // Novo campo para verificar se o usuário é admin
});

const User =  mongoose.model('User', userSchema);

export default User