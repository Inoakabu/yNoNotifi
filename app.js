const Discord = require('discord.js')
const client = new Discord.Client()
const notifier = require('node-notifier');
const token = require('./token.json').token;
const messages = require('./package.json').notification.message;


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag} and id: ${client.user.id}.`);
})

let USER_CHANNEL_ID = undefined

client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember !== undefined) {
        if (findUser(newMember)) {
            USER_CHANNEL_ID = newMember.voiceChannel.id
        }
        if (checkExist(newMember)) {
            // Join
            if (newMember.voiceChannel.id !== oldMember.voiceChannel.id || oldMember === undefined) {
                notification(newMember.user.username, messages.entered)
            }
            // Deaf
            if ((newMember.selfDeaf && newMember.selfMute) && !oldMember.selfDeaf) {
                notification(newMember.user.username, messages.deafed)
            } else if (!(newMember.selfDeaf && newMember.selfMute) && oldMember.selfDeaf) {
                notification(newMember.user.username, messages.undeafed)
            }
        } else if (checkExist(oldMember) && newMember.voiceChannel === undefined) {
            // Leave            
            notification(oldMember.user.username, messages.leaved)
        }
    }
});

function checkExist(user) {
    const selfTest = user.user.id !== client.user.id
    return !selfTest && user.voiceChannel !== undefined && user.voiceChannel.id === USER_CHANNEL_ID
}

function findUser(user) {
    return user.voiceChannel !== undefined && USER_CHANNEL_ID !== user.voiceChannel.id && user.user.id === client.user.id
}

function notification(title, message) {
    console.log(title, message)
    notifier.notify({
        title: title,
        message: message,
        sound: false
    });
}

client.login(token)
