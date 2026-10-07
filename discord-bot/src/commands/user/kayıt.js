// Definitions
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: {
    name: 'registrar',
    cooldown: 5,
    slash: new SlashCommandBuilder()
      .setName('registrar')
      .setDescription('Vincula tu cuenta de HaxBall con Discord utilizando tu código de autenticación.')
      .addStringOption(option =>
        option.setName('codigo')
          .setDescription('Introduce el código de autenticación obtenido en la sala.')
          .setRequired(true))
  },
  async execute (interaction) {
    // Nota: Las IDs de roles se pueden configurar más adelante si usas el sistema de rangos.
    const discord_roles = {
      default: 'AQUÍ_ID_ROL_JUGADOR',
      isVIP: 'AQUÍ_ID_ROL_VIP',
      isMaster: 'AQUÍ_ID_ROL_MASTER',
      isAdmin: 'AQUÍ_ID_ROL_ADMIN'
    }

    let auth = interaction.options.getString('codigo')
    try {
      let userData = null
      if (auth.length === 137) {
        const regex = /(?:idkey)\.(.*?)(?:\.)/g
        auth = regex.exec(auth)[1]
      }
      
      const response = await fetch(`http://localhost:3100/api/getAuth/${auth}`)
      if (response.ok) {
        userData = await response.json()
      }

      if (userData && userData.discordID === '0') {
        // Asignación automática de nombre (Nickname) basado en HaxBall
        await interaction.member.setNickname(userData.isim).catch(() => console.log("No se pudo cambiar el apodo (falta de permisos del bot)."))
        
        await fetch(`http://localhost:3100/api/update/${auth}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ discordID: interaction.user.id })
        })
        
        await interaction.reply({
          content: '¡Te has registrado con éxito en la liga! Tu cuenta de Discord ya está vinculada a tu usuario de HaxBall.',
          ephemeral: true
        })
      } else {
        await interaction.reply({
          content: 'El código introducido es incorrecto, está incompleto o ya ha sido utilizado por otro usuario. Por favor, revísalo o solicita ayuda a un administrador.',
          ephemeral: true
        })
      }
    } catch (e) {
      console.error(e)
      await interaction.reply({
        content: 'Ocurrió un error interno al intentar procesar tu registro. Inténtalo de nuevo más tarde.',
        ephemeral: true
      })
    }
  }
}
