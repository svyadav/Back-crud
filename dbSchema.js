
const mongoose=require('mongoose')
const validator=require('validator')
mongoose.set('strictQuery', true)
var userSchema=new mongoose.Schema({
    firstName:{type:'String',required:true},
    lastName:{type:'String',required:true},
    email:{
        type:'String',
        required:true,
        lowercase:true,
        validate:(value)=>{
            return validator.isEmail(value)
        }

    },
    password:{type:'String',required:true},
    role:{type:'String',default:"admin"},
    createdAt:{type:Date,default:Date.now()}
})

var userModel=mongoose.model('persons',userSchema)
module.exports={userModel,mongoose}