import { Router } from "express";
import { createUser, loginUser } from "../services/userService.js";

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



export default router