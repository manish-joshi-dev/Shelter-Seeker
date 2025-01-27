import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    senderName: { type: String, required: false },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const conversationSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, index: true }, // e.g., pair_<landlordId>_<tenantId>
    listingId: { type: String, required: false, index: true },
    landlordId: { type: String, required: true, index: true },
    tenantId: { type: String, required: true, index: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
)

conversationSchema.index({ landlordId: 1, tenantId: 1 }, { unique: true })

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema)

export default Conversation


