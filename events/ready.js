module.exports = {
  name: "ready",
  once: true,
  async execute(client, Polls) {
    console.log(`Logged in as ${client.user.tag}.`);

    client.user.setActivity("you try to beat MoF stage 5", {
      type: "WATCHING",
    });

    Polls.sync();
    // Polls.sync({ force: true });

    // try {
    //   let link = await client.generateInvite({
    //     permissions: ["ADMINISTRATOR"],
    //   });
    //   console.log(`Here's the invite Phoenix! ${link}`);
    // } catch (e) {
    //   console.log(e.stack);
    // }
  },
};
