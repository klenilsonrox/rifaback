// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    numeros_comprados: [{ 
        numero: { type: String, required: true },
        rifa: { type: mongoose.Schema.Types.ObjectId, ref: 'Rifa', required: true }
    }],
    isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

export default User;
