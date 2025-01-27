import Conversation from '../model/conversation.model.js'
import { errorHandler } from '../utils/error.js'
import User from '../model/user.model.js'
import Listing from '../model/listing.model.js'

export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { listingId, landlordId, tenantId } = req.query
    if (!landlordId || !tenantId) return next(errorHandler(400, 'Missing params'))
    const conversationId = `pair_${landlordId}_${tenantId}`

    let convo = await Conversation.findOne({ landlordId, tenantId })
    if (!convo) {
      convo = await Conversation.create({ conversationId, listingId, landlordId, tenantId, messages: [] })
    }
    res.status(200).json(convo)
  } catch (e) {
    next(e)
  }
}

export const appendMessage = async (req, res, next) => {
  try {
    const { listingId, landlordId, tenantId } = req.body
    const { senderId, senderName, text } = req.body.message || {}
    if (!landlordId || !tenantId || !senderId || !text) return next(errorHandler(400, 'Missing fields'))

    const conversationId = `pair_${landlordId}_${tenantId}`
    const update = {
      $setOnInsert: { conversationId, listingId, landlordId, tenantId },
      $push: { messages: { senderId, senderName, text, createdAt: new Date() } },
    }
    const opts = { new: true, upsert: true }
    const convo = await Conversation.findOneAndUpdate({ landlordId, tenantId }, update, opts)
    res.status(200).json(convo)
  } catch (e) {
    next(e)
  }
}

export const listMyConversations = async (req, res, next) => {
  try {
    const userId = req.user?.id
    if (!userId) return next(errorHandler(401, 'Unauthorized'))

    const convos = await Conversation.find({
      $or: [{ landlordId: userId }, { tenantId: userId }],
    })
      .sort({ updatedAt: -1 })

    const otherUserIds = Array.from(
      new Set(
        convos.map((c) => (c.landlordId === userId ? c.tenantId : c.landlordId))
      )
    )

    const users = await User.find({ _id: { $in: otherUserIds } })
    const idToUser = new Map(users.map((u) => [String(u._id), u]))

    const response = convos.map((c) => {
      const otherId = c.landlordId === userId ? c.tenantId : c.landlordId
      const other = idToUser.get(String(otherId))
      const lastMsg = c.messages?.length ? c.messages[c.messages.length - 1] : null
      return {
        id: c._id,
        conversationId: c.conversationId,
        landlordId: c.landlordId,
        tenantId: c.tenantId,
        listingId: c.listingId || null,
        otherUserId: otherId,
        otherUsername: other?.username || 'User',
        otherAvatar: other?.avatar || null,
        lastMessage: lastMsg,
        updatedAt: c.updatedAt,
        createdAt: c.createdAt,
      }
    })

    res.status(200).json(response)
  } catch (e) {
    next(e)
  }
}

export const startConversationByListing = async (req, res, next) => {
  try {
    const tenantId = req.user?.id
    const { listingId } = req.query
    if (!tenantId) return next(errorHandler(401, 'Unauthorized'))
    if (!listingId) return next(errorHandler(400, 'Missing listingId'))

    const listing = await Listing.findById(listingId)
    if (!listing) return next(errorHandler(404, 'Listing not found'))

    const landlordId = String(listing.userRef)
    if (landlordId === String(tenantId)) return next(errorHandler(400, 'Cannot start chat with yourself'))

    const conversationId = `pair_${landlordId}_${tenantId}`
    let convo = await Conversation.findOne({ landlordId, tenantId })
    if (!convo) {
      convo = await Conversation.create({ conversationId, listingId, landlordId, tenantId, messages: [] })
    }
    res.status(200).json(convo)
  } catch (e) {
    next(e)
  }
}


