const Discord = require('discord.js');
const { currencyPrefix} = require('../../config.json');

module.exports = {
    name: 'daily',
    aliases: ['d'],
    description:
        'Recieve a daily fortune. Claims a sum of money.',
    useCurrency: true,
    cooldown: 86400,
    async execute(message, args, currency) {
        const fortuneWeight = Math.floor(Math.random() * 101) //returns integer 0-100
        let fortuneValue = 0
        console.log(fortuneWeight);
if (fortuneWeight < 5) {
    return message.channel.send(`Uh oh ${message.author}, your fortune today is terrible! You won't gain any money today. Be careful. (¥0)`)
} else if (5 <= fortuneWeight && fortuneWeight < 25) {
    fortuneValue = 30;
    currency.add(message.author.id, fortuneValue * 1);
    return message.channel.send(`Your fortune today seems slightly unlucky, ${message.author}. Take this, and take it easy. (¥30)`)
} else if (25 <= fortuneWeight && fortuneWeight < 60) {
    fortuneValue = 100;
    currency.add(message.author.id, fortuneValue * 1);
    return message.channel.send(`You've recieved a fortune of blessing today ${message.author}! Your day should go well. Here is today's sum! (¥100)`)
} else if (60 <= fortuneWeight && fortuneWeight < 90) {
    fortuneValue = 200;
    currency.add(message.author.id, fortuneValue * 1);
    return message.channel.send(`Your fortune today is particularly lucky ${message.author}! Your day today will be blessed. Here is today's sum! (¥200)`)
} else {
    fortuneValue = 500;
    currency.add(message.author.id, fortuneValue * 1);
    return message.channel.send(`Wow ${message.author}, your fortune today is incredible! Your day is supremely blessed! Please accept this sum for today. (¥500)`)
}
        

    }







}
