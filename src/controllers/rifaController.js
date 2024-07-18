import { comprarBilhetes, criarRifa,deletarRifa,
    atualizarRifa,
    obterRifaPorId,
    listarRifas, 
    buscarUsuarioPorBilhete} from "../services/rifaService.js";

export const comprarBilhetesController = async (req, res) => {
    const { rifaId, quantidadeBilhetes } = req.body;

   const userId= req.userId
   console.log(userId)

  if(quantidadeBilhetes <=0){
    return res.status(403).json({message:"coloque um valor maior que zero"})
  }

    const result = await comprarBilhetes(userId, rifaId, quantidadeBilhetes);
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};


export const criarRifaController = async (req, res) => {
    const result = await criarRifa(req.body);
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(400).json(result);
    }
};

// Controller para deletar uma rifa
export const deletarRifaController = async (req, res) => {
    const { rifaId } = req.params;
    const result = await deletarRifa(rifaId);
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};

// Controller para atualizar uma rifa
export const atualizarRifaController = async (req, res) => {
    const { rifaId } = req.params;
    const result = await atualizarRifa(rifaId, req.body);
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};

// Controller para obter uma rifa por ID
export const obterRifaPorIdController = async (req, res) => {
    const { rifaId } = req.params;
    const result = await obterRifaPorId(rifaId);
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};

// Controller para listar todas as rifas
export const listarRifasController = async (req, res) => {
    const result = await listarRifas();
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};



export const buscarUsuarioPorBilheteController = async(req,res)=>{
    const {numeroBilhete, rifaId} = req.body
    try {
       
       const result = await buscarUsuarioPorBilhete(numeroBilhete, rifaId)
       return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({message:error})
    }
}
