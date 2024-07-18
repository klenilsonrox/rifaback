import { Router } from "express";
import { criarRifaController,deletarRifaController,
    atualizarRifaController,
    obterRifaPorIdController,
    listarRifasController,comprarBilhetesController, 
    buscarUsuarioPorBilheteController} from "../controllers/rifaController.js";
import { isAuthenticated } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/verifyAdmin.js";
import { mostrarUser } from "../middlewares/listarUser.js";

const routerRifa= Router()

routerRifa.post('/rifa/comprar', isAuthenticated, comprarBilhetesController);
routerRifa.post('/rifa', isAuthenticated,isAdmin, criarRifaController);
routerRifa.delete('/rifa/:rifaId', isAuthenticated,isAdmin,deletarRifaController);
routerRifa.put('/rifa/:rifaId',isAuthenticated,isAdmin, atualizarRifaController);
routerRifa.get('/rifa/:rifaId', obterRifaPorIdController);
routerRifa.get('/rifa', mostrarUser, listarRifasController);
routerRifa.post('/rifa/ganhador',isAuthenticated,isAdmin, buscarUsuarioPorBilheteController);


export default routerRifa

