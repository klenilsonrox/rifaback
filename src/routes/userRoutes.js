import { Router } from "express";
import { createUser, loginUser } from "../services/userService.js";

const router = Router()

router.post("/register", async (req,res)=>{
    const {nome,email,password}=req.body
    try {
        const user = {nome,email,password}
        const newUser = await createUser(user);
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