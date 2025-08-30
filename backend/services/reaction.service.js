const reactionRepo = require('../repositories/reaction.repository');

const allowedReactions = ['like', 'dislike'];

async function submitReaction(userId, storeId, reaction) {
  if (!allowedReactions.includes(reaction)) throw new Error('Invalid reaction type');
  return reactionRepo.addOrUpdateReaction(userId, storeId, reaction);
}

async function getReactions(storeId) {
  return reactionRepo.getReactionsForStore(storeId);
}

async function getUserReaction(userId, storeId) {
  return reactionRepo.getUserReaction(userId, storeId);
}

module.exports = { submitReaction, getReactions, getUserReaction };
