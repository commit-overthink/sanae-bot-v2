module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}.`);
    
    try {
      let link = await client.generateInvite({
        permissions: ["ADMINISTRATOR"],
      });
      console.log(`Here's the invite Phoenix! ${link}`);
    } catch (e) {
      console.log(e.stack);
    }
    // prettier-ignore
    client.user.setActivity("you try to beat MoF stage 5", { type: "WATCHING"});
  },
};
