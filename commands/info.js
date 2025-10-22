import {
    SlashCommandBuilder,
    PermissionFlagsBits
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('info')
        .setNameLocalizations({
            vi: 'thongtin',
            fr: 'infos',
            ja: '情報'
        })
        .setDescription('Get information about users, servers, or bots.')
        .setDescriptionLocalizations({
            vi: 'Xem thông tin về người dùng, máy chủ hoặc bot.',
            fr: 'Obtenir des informations sur les utilisateurs, serveurs ou bots.',
            ja: 'ユーザー、サーバー、またはボットの情報を取得します。'
        })
        .addSubcommand(sub =>
            sub
                .setName('user')
                .setDescription('Get information about a user.')
                .setDescriptionLocalizations({
                    vi: 'Lấy thông tin về người dùng.',
                    fr: 'Obtenir des informations sur un utilisateur.',
                    ja: 'ユーザーに関する情報を取得します。'
                })
                .addUserOption(opt =>
                    opt
                        .setName('target')
                        .setDescription('Select a user')
                        .setDescriptionLocalizations({
                            vi: 'Chọn người dùng',
                            fr: 'Choisir un utilisateur',
                            ja: 'ユーザーを選択'
                        })
                        .setRequired(true)
                )
                .addStringOption(opt =>
                    opt
                        .setName('format')
                        .setDescription('Choose display format')
                        .setDescriptionLocalizations({
                            vi: 'Chọn định dạng hiển thị',
                            fr: 'Choisir le format d’affichage',
                            ja: '表示形式を選択'
                        })
                        .addChoices(
                            { name: 'Compact', value: 'compact' },
                            { name: 'Detailed', value: 'detailed' },
                            { name: 'Raw JSON', value: 'json' }
                        )
                )
                .addStringOption(opt =>
                    opt
                        .setName('category')
                        .setDescription('Choose a category for the info command.')
                        .setDescriptionLocalizations({
                            vi: 'Chọn danh mục cho lệnh info.',
                            fr: 'Choisir une catégorie pour la commande info.',
                            ja: 'info コマンドのカテゴリを選択します。'
                        })
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName('server')
                .setDescription('Get server information.')
                .setDescriptionLocalizations({
                    vi: 'Lấy thông tin về máy chủ.',
                    fr: 'Obtenir des informations sur le serveur.',
                    ja: 'サーバーに関する情報を取得します。'
                })
                .addBooleanOption(opt =>
                    opt
                        .setName('show_roles')
                        .setDescription('Include role list')
                        .setDescriptionLocalizations({
                            vi: 'Bao gồm danh sách vai trò',
                            fr: 'Inclure la liste des rôles',
                            ja: 'ロール一覧を含める'
                        })
                )
                .addStringOption(opt =>
                    opt
                        .setName('category')
                        .setDescription('Choose a category for the info command.')
                        .setDescriptionLocalizations({
                            vi: 'Chọn danh mục cho lệnh info.',
                            fr: 'Choisir une catégorie pour la commande info.',
                            ja: 'info コマンドのカテゴリを選択します。'
                        })
                        .setAutocomplete(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async autocomplete(interaction) {
        const focused = interaction.options.getFocused();
        const categories = ['general', 'system', 'developer', 'fun', 'hidden'];
        const filtered = categories.filter(c => c.startsWith(focused.toLowerCase()));
        await interaction.respond(filtered.map(c => ({ name: c, value: c })));
    },

    async execute(interaction) {
        const sub = interaction.options.getSubcommand(false);
        const category = interaction.options.getString('category') ?? 'general';

        if (sub === 'user') {
            const user = interaction.options.getUser('target');
            const format = interaction.options.getString('format') ?? 'compact';
            await interaction.reply({
                content: `📜 Info about **${user.username}** (format: ${format}, category: ${category})`,
                ephemeral: true
            });
        } else if (sub === 'server') {
            const showRoles = interaction.options.getBoolean('show_roles');
            const roles = showRoles
                ? interaction.guild.roles.cache.map(r => r.name).join(', ')
                : 'Hidden';
            await interaction.reply({
                content: `🏰 Server: **${interaction.guild.name}**\nRoles: ${roles}\nCategory: ${category}`,
                ephemeral: true
            });
        }
    }
};
