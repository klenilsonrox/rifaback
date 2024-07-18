import mongoose from 'mongoose';

const rifaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    urlImage: { type: String},
    descricao: { type: String, required: true },
    preco: { type: Number, required: true },
    total_bilhetes: { type: Number, required: true },
    bilhetes_vendidos: { type: Number, default: 0 },
    numeros_comprados: { type: [String], default: [] }, // Alterado para String
    data_sorteio: { type: Date, required: true },
    sorteada: { type: Boolean, default: false },
    ganhador: { type: String, default: null }
});

const Rifa = mongoose.model('Rifa', rifaSchema);

export default Rifa;
