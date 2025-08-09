import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers // nécessaire pour guildMemberAdd
  ]
});

// ✅ Démarrage + statut rotatif
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  const statuses = [
    "📹 Caméra d’entrée — 100% opérationnelle",
    "🤖 Surveillance automatique 24/7",
    "🔒 Sécurité & accueil garantis pour tous"
  ];

  let i = 0;
  setInterval(() => {
    client.user.setPresence({
      activities: [{ name: statuses[i], type: 3 }], // 3 = "Regarde"
      status: "online"
    });
    i = (i + 1) % statuses.length;
  }, 10000);
});

// 👋 Bienvenue auto avec logo dans le salon WELCOME_CHANNEL_ID
client.on('guildMemberAdd', async (member) => {
  try {
    const channelId = process.env.WELCOME_CHANNEL_ID;
    const logoUrl   = process.env.SERVER_LOGO_URL;

    const channel = await member.guild.channels.fetch(channelId).catch(() => null);
    if (!channel) return console.log("⚠️ Salon welcome introuvable. Vérifie WELCOME_CHANNEL_ID");

    const embed = new EmbedBuilder()
      .setColor(0xFF7A00)
      .setImage(logoUrl)  // logo en grand au-dessus
      .setTitle(`👋 Bienvenue, ${member.user.username} !`)
      .setDescription(`Ravi de t’avoir sur **CellBlock RP** 🔒`)
      .setThumbnail(member.user.displayAvatarURL({ extension: 'png', size: 256 }))
      .setFooter({ text: 'CellBlock RP | WL', iconURL: logoUrl });

    await channel.send({
      content: `👮 ${member} vient d’entrer dans le bloc. Tenez vos barreaux !`,
      embeds: [embed]
    });
  } catch (e) {
    console.error('❌ Erreur welcome :', e);
  }
});

client.login(process.env.TOKEN);
