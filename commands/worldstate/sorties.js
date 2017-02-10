const stringThings = require("../../util/stringThings");
const ws = require("../../ws/ws");

function removeUnderscorePrefixes(str) {
  if (str.includes("SORTIE"))
    return str.replace(/SORTIE_.*?_/g, "");
  else if (str.includes("MT"))
    return str.replace("MT_", "");
  return str;
}

module.exports = {
  name: "sorties",
  desc: "get current sorties",
  example: "sorties",
  run: (bot, message, args, commands) => {
    let state = ws.getWs();
    let currentTime = state.Time;
    let sorties = state.Sorties[0];
    let expire = sorties.Expiry["$date"]["$numberLong"];
    let timeLeftSeconds = (expire - currentTime) * 1000;
    let sortieBoss = removeUnderscorePrefixes(sorties.Boss);
    let missions = sorties.Variants;
    let deets = `\`\`\`haskell\n${" ".repeat(18)}boss:     ${sortieBoss}\n`; // nice spacing!!
    // 50-60, 65-80, 80-100 what kind of shitty pattern is this?
    let levels = ["50-60", "65-80", "80-100"];
    for (let idx = 0; idx < missions.length; idx++) {
      deets += `levels: ${stringThings.padRight(levels[idx], 10)}`;
      deets += `modifier: ${stringThings.padRight(removeUnderscorePrefixes(missions[idx].modifierType), 20)}`;
      deets += `mission type: ${stringThings.padRight(removeUnderscorePrefixes(missions[idx].missionType), 20)} \n`;
      // deets += `${removeUnderscorePrefixes(missions[idx].node)} \n`
    }
    deets += `\`\`\``;
    message.reply(deets);
  }
}