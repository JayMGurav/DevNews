import mongoose from 'mongoose'

const VoteSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });


VoteSchema.index({link: 1, user: 1});
export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema)