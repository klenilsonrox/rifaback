import { Router } from "express";
import { createUser, getUserById, loginUser, requestPasswordReset, resetPassword } from "../services/userService.js";
import { isAuthenticated } from "../middlewares/authenticate.js";


const router = Router()

router.post("/register", async (req,res)=>{
    const {nome,email,password}=req.body
    try {
        if(!nome || !email || !password ){
            return res.status(401).json({message:"preencha todos os campos"})
        }
        const newUser = await createUser({nome,email,password});
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})




router.post('/login', async (req, res) => {
    try {
        const result = await loginUser(req.body.email, req.body.password);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const {userId}= req
        const result = await getUserById(userId)
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;
    try {
        await requestPasswordReset(email);
        res.status(200).json({ message: 'E-mail de recuperação enviado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
  

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        await resetPassword(token, newPassword);
        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router