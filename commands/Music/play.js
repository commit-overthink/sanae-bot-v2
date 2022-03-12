const Discord = require("discord.js");
const {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
  StreamType,
} = require(`@discordjs/voice`);
const ytdl = require("ytdl-core");
const { defaultEmbedColor } = require("../../config.json");

module.exports = {
  name: "play",
  description: "Plays music. Make sure you're in a VC",
  aliases: ["join", "p"],
  args: true,
  usage: "<YouTube URL>",
  useMusic: true,
  async execute(message, args, MusicQueues) {

      const queueAdd = async (input) => {
          // Create queue object
          let queue = {
              songs: [],
              isRepeating: false,
              // TODO: add repeat feature
          }

          // Check to see if a "stored queue" exists in the db, put songs into it
          const storedQueue = await getStoredQueue();
          if (storedQueue === null) {
              // Check to see if songs exist, add them to the queue object.
              for (n in input) {
                  const songInfo = await getSongInfo(input[n]);
                  if (songInfo === null) {
                      message.channel.send(`Sorry ${message.member}, but the song \`${input[n]}\` doesn't exist!`);
                  } else {
                      queue.songs.push(`${input[n]}`);
                      message.channel.send(`${message.member}, I added *${songInfo.videoDetails.title}* to the queue!`);
                  }
              }

              // create the stored queue and push queue object to it.
              MusicQueues.create({
                  guild: message.guild.id,
                  songs: queue.songs, 
                  isRepeating: false,
              });
          } else {
              // stored queue is already in memory, no need to get again.
              // convert to object in memory
              const convertedQueue = storedQueue.dataValues.songs.split(",");
              convertedQueue.forEach((song) => {
                  queue.songs.push(song);
              });

              // append new songs with same method as earlier.
              for (n in input) {
                  const songInfo = await getSongInfo(input[n]);
                  if (songInfo === null) {
                      message.channel.send(`Sorry ${message.member}, but the song \`${input[n]}\` doesn't exist!`);
                  } else {
                      queue.songs.push(`${input[n]}`);
                      message.channel.send(`${message.member}, I added *${songInfo.videoDetails.title}* to the queue!`);
                  }
              }
              
              // send object to DB
              const promises = [];
              queue.songs.forEach(() => {
                  promises.push(
                      MusicQueues.update(
                          { songs: queue.songs },
                          { where: { guild: message.guild.id } }
                      )
                  );
              });
              Promise.all(promises).catch(console.error);
          }

          // Queue Obj:
          //    songs: ARR;
          //    isRepeating: BOOL
          // *Songs are stored by their URLs.
      }

      const queueRemove = async () => {
          // create queue object
          let queue = {
              songs: [],
              isRepeating: false,
          }

          // get stored queue
          const storedQueue = await getStoredQueue();

          // convert to object in memory
          const convertedQueue = storedQueue.dataValues.songs.split(",");
          convertedQueue.forEach((song) => {
              queue.songs.push(song);
          });

          // remove specified song from queue object (index 0), in try-catch in case of unkown problems.
          try {
              queue.songs.shift();
          } catch (e) {
              console.error(e);
          }

          // delete current stored queue and push queue obj to database (inefficient, but should work)
          try {
              // this if statement exists in order to prevent an empty array from being passed into the database
              MusicQueues.destroy({ where: { guild: message.guild.id } });
              if (queue.songs.length > 0){
                  MusicQueues.create({
                      guild: message.guild.id,
                      songs: queue.songs, 
                      isRepeating: false,
                  });
              } 
          } catch (e) {
              console.error(e);
          }
      }

      const getSongInfo = async (url) => {
          let data = null;
          try {
              data = await ytdl.getBasicInfo(url);
          } catch (e) {
              console.log(`Error with input "${url}". Doesn't exist?`);
          }
          return data;
      }

      const getStoredQueue = async () => {
          let storedQueue = null;
          try {
            storedQueue = await MusicQueues.findOne({
                where: { guild: message.guild.id }
            });
          } catch (e) {
              console.log(`Error with finding storedQueue. Doesn't exist?`);
              console.error(e);
          }
          return storedQueue;
      }

      const playNextSong = async () => {
          // create queue object
          let queue = {
              songs: [],
              isRepeating: false,
          }

          // get stored queue
          const storedQueue = await getStoredQueue();

          // stored queue will return as null if there are no songs left 
          if (storedQueue === null) {
              connection.destroy();
              return message.channel.send(`Looks like there's no more songs to play, see ya ${message.member}!`);
          }

          // convert to object in memory
          const convertedQueue = storedQueue.dataValues.songs.split(",");
          convertedQueue.forEach((song) => {
              queue.songs.push(song);
          });
          
          // use case: check for no members?

          // play next song in queue
          // and remove from stored queue
          const audioStream = ytdl(queue.songs[0], {
              filter: "audioonly",
              highWaterMark: 1 << 25,
          });
          const resource = createAudioResource(audioStream, {
              inputType: StreamType.Arbitrary,
          });

          const songInfo = await getSongInfo(queue.songs[0]);
          const embed = getEmbed(songInfo, `*"Now Playing!"*`);
          message.channel.send({ embeds: [embed] });

          player.play(resource);
          queueRemove();
      }

      const getEmbed = (metadata, title) => {
          const videoData = metadata.videoDetails;                                            
                                                                                              
          const seconds = Math.floor(videoData.lengthSeconds % 60);           
          const minutes = Math.floor((videoData.lengthSeconds % (60 * 60)) / 60);
          const hours = Math.floor((videoData.lengthSeconds / (60 * 60)) % 24);

          let duration = "";

          if (hours >= 10) duration += `${hours}:`;
          else if (hours > 0 && hours < 10) duration += `0${hours}:`;

          if (minutes >= 10 ) duration += `${minutes}:`;
          else if (minutes > 0 && minutes < 10) duration += `0${minutes}:`;
          else duration += `00:`;

          if (seconds >= 10) duration += `${seconds}`
          else if (seconds > 0 && seconds < 10) duration += `0${seconds}`
          else duration += `00`;
                                                                                              
          const embed = new Discord.MessageEmbed()                                            
            .setColor(defaultEmbedColor)                                                      
            // .setTitle(`*"Now playing!"*`)                                                     
            .setTitle(`${title}`)
            .setDescription(`**[${videoData.title}](${videoData.video_url})**`)               
            .setThumbnail(                                                                    
              `https://i.ytimg.com/vi/${videoData.videoId}/maxresdefault.jpg`                 
            )                                                                                 
            .addFields(                                                                       
              {                                                                               
                name: `Channel`,                                                              
                value: `${videoData.ownerChannelName}`,                                       
                inline: true,                                                                 
              },                                                                              
              { name: `Duration`, value: `${duration}`, inline: true },                       
              // { name: `Duration`, value: `${videoData.lengthSeconds}`, inline: true },     
              {                                                                               
                name: `Upload Date`,                                                          
                value: `${videoData.publishDate}`,                                            
                inline: true,                                                                 
              }                                                                               
              // { name: "Position in queue", value: ""}                                      
            );                                                                                
          return embed;                                                                       
      };


      const activeChannel = message.member.voice;
      if (activeChannel.channel === null) {
          return message.channel.send(`Sorry ${message.member}, but you need to be in a voice channel in order to use this command!`);
      }

      joinVoiceChannel({
          channelId: activeChannel.channelId,
          guildId: activeChannel.guild.id,
          adapterCreator: activeChannel.guild.voiceAdapterCreator,
      });

      const connection = getVoiceConnection(activeChannel.guild.id);

      const player = createAudioPlayer();
      // Check if subscription already exists, saves on memory.
      if (connection.state.subscription) {
          // Allows user to add to queue while song is playing.
          queueAdd(args);
      } else connection.subscribe(player);


      // Play music
      connection.on(VoiceConnectionStatus.Ready, async () => {
          await queueAdd(args);
          playNextSong();
      });

      player.on(AudioPlayerStatus.Playing, () => {
      });
      player.on(AudioPlayerStatus.Idle, () => {
          playNextSong();
      });

  }
}
