module.exports = {
  name: "ready",
  once: true,
  async execute(client, Users, currency) {
    console.log(`Logged in as ${client.user.tag}.`);

    client.user.setActivity("you try to beat MoF stage 5", {
      type: "WATCHING",
    });

    // Put balences for currency system in memory
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));

    // try {
    //    let link = await client.generateInvite({
    //      permissions: ["ADMINISTRATOR"],
    //    });
    //    console.log(`Here's the invite Phoenix! ${link}`);
    // } catch (e) {
    //    console.log(e.stack);
    // }
  },
};
