import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "name is required field"]
  },
  email: {
    type: String,
    required: [true, "email is required field"],
    unique: true
  },
},{timestamps: true });


export default mongoose.models.User || mongoose.model('User', UserSchema)