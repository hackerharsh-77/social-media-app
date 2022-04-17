const { append } = require('express/lib/response');

const router = require('express').Router();

router.get("/", (req,res)=>{
    res.send("hey its user route")
})

module.exports = router