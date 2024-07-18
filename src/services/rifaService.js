import Rifa from "../models/rifa.js";
import User from "../models/user.js";


/**
 * Função para comprar bilhetes
 * @param {string} userId - ID do usuário
 * @param {string} rifaId - ID da rifa
 * @param {number[]} numeros - Array de números a serem comprados
 * @returns {object} - Objeto com o status da compra e mensagem
 */



// Função auxiliar para gerar números aleatórios únicos
// Função auxiliar para gerar números aleatórios únicos
const gerarNumerosAleatorios = (quantidade, max, numerosExistentes) => {
    const numerosGerados = [];
    const numeroMaximoDigitos = max.toString().length;

    while (numerosGerados.length < quantidade) {
        const numeroAleatorio = Math.floor(Math.random() * max) + 1;
        const numeroComZeros = padZeroes(numeroAleatorio, numeroMaximoDigitos);

        if (!numerosExistentes.includes(numeroComZeros) && !numerosGerados.includes(numeroComZeros)) {
            numerosGerados.push(numeroComZeros);
        }
    }
    return numerosGerados;
};

// Função auxiliar para adicionar zeros à esquerda
const padZeroes = (num, size) => {
    let s = num.toString();
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
};

// Serviço para comprar bilhetes de rifa
export const comprarBilhetes = async (userId, rifaId, quantidadeBilhetes) => {
    let numerosComprados; // Definir a variável aqui para ser acessível dentro do bloco try e catch
    try {
        const rifa = await Rifa.findById(rifaId);
        if (!rifa) {
            throw new Error('Rifa não encontrada');
        }

        if (rifa.sorteada) {
            throw new Error('Rifa já foi sorteada');
        }

        // Verificar se há bilhetes suficientes disponíveis
        if (rifa.bilhetes_vendidos + quantidadeBilhetes > rifa.total_bilhetes) {
            throw new Error('Não há bilhetes suficientes disponíveis');
        }

        // Verificar se o usuário existe e se já comprou bilhetes demais
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        if (user.numeros_comprados.length + quantidadeBilhetes > 2000) {
            throw new Error('Cada usuário pode comprar no máximo 2.000 bilhetes');
        }

        // Gerar números aleatórios únicos
        numerosComprados = gerarNumerosAleatorios(quantidadeBilhetes, rifa.total_bilhetes, rifa.numeros_comprados);

        // Ordenar os números gerados
        numerosComprados.sort((a, b) => parseInt(a) - parseInt(b));

        // Atualizar o documento da rifa com os novos números comprados
        rifa.numeros_comprados.push(...numerosComprados);
        rifa.bilhetes_vendidos += quantidadeBilhetes;
        await rifa.save();

        // Ordenar os números comprados pelo usuário antes de salvar
        user.numeros_comprados.push(...numerosComprados);
        user.numeros_comprados.sort((a, b) => parseInt(a) - parseInt(b));
        await user.save();

        return { success: true, message: 'Bilhetes comprados com sucesso', rifa, user, numerosComprados };
    } catch (error) {
        if (error.message === 'Usuário não encontrado' && numerosComprados) {
            // Remover os números comprados pelo usuário não encontrado
            const rifa = await Rifa.findById(rifaId);
            if (rifa) {
                rifa.numeros_comprados = rifa.numeros_comprados.filter(num => !numerosComprados.includes(num));
                rifa.bilhetes_vendidos -= quantidadeBilhetes;
                await rifa.save();
            }
        }
        return { success: false, message: error.message };
    }
};


export const criarRifa = async (data) => {
    try {
        const novaRifa = new Rifa(data);
        await novaRifa.save();
        return { success: true, message: 'Rifa criada com sucesso', rifa: novaRifa };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Serviço para deletar uma rifa
export const deletarRifa = async (rifaId) => {
    try {
        const rifa = await Rifa.findById(rifaId);
        if (!rifa) {
            throw new Error('Rifa não encontrada');
        }

        // Remover números comprados dos usuários
        await User.updateMany(
            { numeros_comprados: { $in: rifa.numeros_comprados } },
            { $pull: { numeros_comprados: { $in: rifa.numeros_comprados } } }
        );

        // Deletar a rifa
        await Rifa.findByIdAndDelete(rifaId);

        return { success: true, message: 'Rifa deletada com sucesso' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Serviço para atualizar uma rifa
export const atualizarRifa = async (rifaId, data) => {
    try {
        const rifa = await Rifa.findByIdAndUpdate(rifaId, data, { new: true });
        if (!rifa) {
            throw new Error('Rifa não encontrada');
        }
        return { success: true, message: 'Rifa atualizada com sucesso', rifa };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Serviço para obter uma rifa por ID
export const obterRifaPorId = async (rifaId) => {
    try {
        const rifa = await Rifa.findById(rifaId);
        if (!rifa) {
            throw new Error('Rifa não encontrada');
        }
        return { success: true, rifa };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Serviço para listar todas as rifas
export const listarRifas = async () => {
    try {
        const rifas = await Rifa.find();
        return { success: true, rifas };
    } catch (error) {
        return { success: false, message: error.message };
    }
};



export const buscarUsuarioPorBilhete = async (numeroBilhete, rifaId) => {
    try {
        const rifa = await Rifa.findById(rifaId);
        if (!rifa) {
            throw new Error('Rifa não encontrada');
        }

        // Verificar se o número do bilhete está entre os bilhetes vendidos
        const numeroComZeros = padZeroes(numeroBilhete, rifa.total_bilhetes.toString().length);
        if (!rifa.numeros_comprados.includes(numeroComZeros)) {
            return { success: true, message: 'Número não comprado' };
        }

        // Encontrar o usuário que comprou o bilhete
        const user = await User.findOne({ numeros_comprados: numeroComZeros });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return { success: true, message: 'Usuário encontrado', user };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


