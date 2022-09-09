const mongoose = require("mongoose");

const ChannelsReactionSchema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String,
    React: String
});

const messageModel = module.exports = mongoose.model('ChannelsReaction', ChannelsReactionSchema);