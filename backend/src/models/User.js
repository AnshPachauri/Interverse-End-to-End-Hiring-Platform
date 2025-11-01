import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profileImage: {
        type: String,
        default: "",
    },
    password:{
        type:String,
        required:true
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    }
},
{
    timestamps:true
}
);

const User = mongoose.model('User',UserSchema);
export default User;