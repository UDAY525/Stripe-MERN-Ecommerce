const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');

async function userForgetPasswordController(req,res) {
    try{
        const {email,newPassword,answer} = req.body;
        if(!email){
            throw new Error("Please provide email")
        }
        if(!newPassword){
             throw new Error("Please provide password")
        }
        if(!answer){
            throw new Error("Please provide answer")
        }  

        const user = await userModel.findOne({email,answer});

        if(!user){
            throw new Error("User not found")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(newPassword, salt);

        await userModel.findByIdAndUpdate(user._id,{password:hashPassword});
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
            error: false
          });

    }
    catch(err) {
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}

module.exports = userForgetPasswordController