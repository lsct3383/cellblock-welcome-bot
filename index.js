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

// 👋 Bienvenue auto + auto‑rôle "Attente de jugement"
client.on('guildMemberAdd', async (member) => {
  try {
    const channelId = process.env.WELCOME_CHANNEL_ID;
    const logoUrl   = process.env.SERVER_LOGO_URL;

    // --- AUTO‑RÔLE ---
    const roleId = process.env.ROLE_PENDING_ID; // <= ajoute cette variable dans Railway
    if (roleId) {
      try {
        await member.roles.add(roleId);
        console.log(`✅ Rôle 'Attente de jugement' ajouté à ${member.user.tag}`);
      } catch (err) {
        console.error('❌ Impossible d’ajouter le rôle (hiérarchie/permissions) :', err.message);
      }
    } else {
      console.warn('⚠️ ROLE_PENDING_ID non défini dans les variables.');
    }

    // --- MESSAGE DE BIENVENUE ---
    const channel = await member.guild.channels.fetch(channelId).catch(() => null);
    if (!channel) return console.log("⚠️ Salon welcome introuvable. Vérifie WELCOME_CHANNEL_ID");

    const embed = new EmbedBuilder()
      .setColor(0xFF7A00)
      .setImage(logoUrl)
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
