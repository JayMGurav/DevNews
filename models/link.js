import mongoose from 'mongoose'

const LinkSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "description is required field"]
  },
  url: {
    type: String,
    required: [true, "url is required field"],
    unique: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  voteCount: {
    type: Number,
    default: 0,
    required: true
  }
}, { timestamps: true });

LinkSchema.index(
  {description: "text", url: "text"},
  {name: "LinkIndex", description: 10, url: 5 }
)
export default mongoose.models.Link || mongoose.model('Link', LinkSchema)