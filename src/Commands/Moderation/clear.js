import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export const Command = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clear messages from a chat")
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('amount of messages to delete')
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('pick a user to clear their messages')
        ),
    options: {
        disabled: false,
        ownerOnly: false,
        permissions: [PermissionFlagsBits.BanMembers],
    },
    /**
     * @param {Object} param
     * @param {import('discord.js').Client} param.client
     * @param {import("discord.js").CommandInteraction} param.int
     */
    run: async ({ client, int }) => {
        const { channel, options } = int

        const amount = options.getInteger('amount');
        const target = options.getUser('user');

        const messages = await channel.messages.fetch({
            limit: amount + 1
        });

        const res = new EmbedBuilder()
            .setColor('#2F3136')

        if (target) {
            let i = 0;
            const filitered = [];

            (messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filitered.push(msg)
                    i++;
                }

            })

            await channel.bulkDelete(filitered).then(messages => {
                res.setDescription(`Deleted ${messages.size} from ${target}`)
                int.reply({ embeds: [res] });
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`Deleted ${messages.size} from this channel`)
                int.reply({ embeds: [res] });
            })

        }

    },
};