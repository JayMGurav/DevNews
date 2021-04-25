import mongoose from 'mongoose'

const LinkSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "description is required field"]
  },
  url: {
    type: String,
    required: [true, "url is required field"]
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });


export default mongoose.models.Link || mongoose.model('Link', LinkSchema)