module.exports = {
  name: "ready",
  once: true,
  async execute(client, Prompts) {
    console.log(`Logged in as ${client.user.tag}.`);

    // prettier-ignore
    client.user.setActivity("you try to beat MoF stage 5", { type: "WATCHING"});
    Prompts.sync();
    // sets up Prompts modal for poll commands
    // Prompts.sync({ force: true });
    // use to reset the modal.

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
