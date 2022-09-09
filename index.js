const Discord = require("discord.js")
require("dotenv").config();
const mongoose = require("mongoose");
const prefix = require("./config.json").prefix;
const client = new Discord.Client({
    intents: [ 
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        //Discord.Intents.FLAGS.GUILD_BANS,
        //Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        //Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        //Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        //Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        //Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        //Discord.Intents.FLAGS.DIRECT_MESSAGES,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ],
});
mongoose.connect(process.env.mongoURL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(console.log("Connected"))

client.on("ready", async() => {
console.log(`Connected \n bot ${client.user.username}`)
});


client.on("message", async(message) => {
    if (message.content.startsWith("test")) {
        message.reply({
            content: "Test"
        })
    }
})

//channel reaction set
const data_1  = require("./modules/ChannelsReaction")
client.on('message', async(message) => {
    if (message.content.startsWith(prefix + "addchannel")) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        const args =  message.content.slice(prefix.length).trim().split(/ +/g);
        if (args[0] && args[1]) {
            const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (channel) {
                const newData = data_1.create({
                    GuildID: message.guildId,
                    ChannelID: channel.id,
                    React: args[2]
                });
                (await newData).save()
                    message.react("✔")
                
            }
        } else if (!args[0]) return;
    }
});



//reactions
const data_12 =require("./modules/ChannelsReaction");
client.on("messageCreate", async(message) => {
    if (message.content) {
        const data = await data_12.findOne({
            GuildID: message.guildId
        });

        if (data) {
            const channel = message.guild.channels.cache.get(data.ChannelID);
            if (message.channel.id === channel.id) {
                try {
                    const emoji = client.emojis.cache.find(emo => emo.name === data.React)
                    if (!emoji) return console.log(emoji, data.React)
                    message.react(emoji)
                } catch (e) {
                    null
                }
            } 
        }
    }
})








client.login(process.env.TOKEN)