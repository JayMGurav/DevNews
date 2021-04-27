import mongoose from 'mongoose'

const LinkSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });


export default mongoose.models.Vote || mongoose.model('Vote', LinkSchema)