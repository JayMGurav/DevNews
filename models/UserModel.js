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
  password:  {
    type: String,
    required: [true, "password is required field"],
  },
},{timestamps: true });

UserSchema.index({email: 1});
export default mongoose.models.User || mongoose.model('User', UserSchema)