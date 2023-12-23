import express from "express"

import producto from "./fs/ProductFsManager.js"

const server = express()

const port = 8080
const ready = () => console.log(`Server ready on port ${port}`);

// Middleware
server.use(express.urlencoded({extended: true}))

// Endpoints
server.get("/api/products",(req, res) => {
    try {
        const allProducts = producto.read()
        if(Array.isArray(allProducts)){
            return res.status(200).json({
                success: true,
                response: allProducts
            })
        }else{
            return res.status(404).json({
                success: false,
                message: allProducts
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

server.get("api/products/:pid",(req, res) => {
    const {pid} = req.params
    const one = producto.readOne(pid)
    return res.status(200).json(one)
})