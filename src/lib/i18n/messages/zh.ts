import type { Messages } from "./en";

/**
 * 简体中文。缺失的词条会各自回退到英文，所以只翻译一部分也完全是有用的贡献
 * ——会哪条就填哪条，其余留空即可。
 */
const zh: Partial<Messages> = {
  "app.title": "多人轮抽",
  "app.subtitle": "《魔法门之英雄无敌 III》桌游版",
  "lang.label": "语言",
  "footer.more": "喜欢我做的东西？也看看：",
  "footer.cardCreator": "卡牌制作器",
  "footer.editor": "剧本编辑器",
  "footer.generator": "随机剧本生成器",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "设置轮抽",
  "lobby.players": "玩家",
  "lobby.format": "赛制",
  "lobby.format.dealt": "发牌",
  "lobby.format.snake": "蛇形",
  "lobby.format.dealt.help":
    "一次洗牌就给每位玩家一份别人拿不到的备选，于是大家同时选，两个人也不可能选到同一个阵营。",
  "lobby.format.snake.help":
    "按顺序轮流，一次一人，每人从尚未被选走的阵营里重新抽一份。阵营不够、无法让每个人都有真正选择时用它。",
  "lobby.factionPool": "每人可选阵营数",
  "lobby.heroPool": "每人可选英雄数",
  "lobby.pool.forced": "没得选——阵营直接发到手",
  "lobby.pool.forcedHero": "没得选——英雄直接发到手",
  "lobby.pool.all": "全部",
  "lobby.pool.all.help":
    "你的阵营还剩下的所有英雄。若两位玩家可能拿到同一个人物——塔纳姆在六个阵营里都有卡——英雄环节就改成绕桌一个一个来，而不是所有人同时选。",
  "lobby.bans": "每人禁阵营数",
  "lobby.bans.none": "不禁",
  "lobby.turns": "回合",
  "lobby.turns.help": "一个回合怎么走，以及座位是不是由你自己挑。",
  "lobby.combined": "阵营和英雄在同一回合",
  "lobby.draftSeats": "连座位顺序也轮抽",
  "lobby.combined.help":
    "一位玩家先拿阵营，紧接着拿该阵营的英雄，然后才轮到下一位，绕桌一个一个来。关闭时：所有人先抽阵营，之后再抽英雄。",
  "lobby.draftSeats.help": "其余都抽完后，每人从还空着的位置里挑一个。关闭时：由种子决定。",
  "lobby.heroBans": "每人禁英雄数",
  "lobby.heroBans.help":
    "在阵营抽完之后单独一轮花掉——在不知道谁玩什么之前，禁英雄只是猜。会让某人无英雄可抽的禁用会被拒绝。",
  "lobby.heroBans.blindHelp":
    "阵营和英雄同回合时，不存在“城镇已知、英雄未定”的那一刻，所以这些禁用发生在任何抽取之前。是猜，不是读。",
  "lobby.banVisibility": "禁用方式",
  "lobby.banVisibility.open": "公开",
  "lobby.banVisibility.blind": "盲禁",
  "lobby.banVisibility.open.help": "一个一个来，大家都看着。",
  "lobby.banVisibility.blind.help":
    "所有人同时禁，然后一起亮出。两位玩家可以把禁用花在同一个英雄或同一个阵营上，它也只会被移除一次。两轮禁用都适用。",
  "lobby.during": "轮抽进行中",
  "lobby.conceal": "把选择藏到最后再揭晓",
  "lobby.conceal.help":
    "在最后那张结果表之前，谁也看不到别人抽了什么、禁了什么——围着一块屏幕玩时，这意味着回合之间谁也看不到任何东西。已经被拿走的仍然显示在板面上，因为那本来就抽不到。",
  "lobby.heroRule": "英雄来自",
  "lobby.heroRule.own": "自己的阵营",
  "lobby.heroRule.unique-faction": "任意阵营，各一位",
  "lobby.heroRule.any": "不限",
  "lobby.heroRule.own.help": "你抽到的英雄属于你抽到的那个阵营。",
  "lobby.heroRule.unique-faction.help":
    "你的英雄可以来自你没抽到的阵营，但两位玩家的英雄不能出自同一个本家阵营。",
  "lobby.heroRule.any.help": "任意阵营的任意英雄。",
  "lobby.uniqueIdentity": "同一英雄只许一个",
  "lobby.uniqueIdentity.help":
    "塔纳姆在六个阵营里有卡，哈特大人在两个阵营里有。打开后，只有一位玩家能当塔纳姆。",
  "lobby.otherTowns": "英雄可以来自别人的城镇",
  "lobby.otherTowns.combined":
    "阵营和英雄同回合时始终开启：第一位玩家拿英雄时，第二位还没有城镇，也就还没有需要避开的别人的城镇。",
  "lobby.sharedCards": "一张卡，两个英雄",
  "lobby.sharedCards.help":
    "英雄卡是双面的，抽走一面等于拿走整张卡，背面那位英雄也跟着离场。禁用则不然——禁的是英雄，不是卡。几乎每一对都同属一个城镇，所以除非允许跨阵营抽英雄，这条很少起作用；例外是塔纳姆，他那六张卡其实只有三张。",
  "lobby.sharedCards.nodata":
    "这需要一份“哪些英雄共用一张卡”的清单，社区数据库里还没有。把配对写进 scripts/build-catalogue.mjs 里的 CARD_PAIRS，这个开关就会启用。",
  "lobby.collection": "你的收藏",
  "lobby.collection.summary": "{factions} 个阵营，{heroes} 位英雄",
  "lobby.collection.all": "全部盒子",
  "lobby.collection.none": "一个盒子也没有",
  "lobby.mode": "游玩方式",
  "lobby.mode.local": "共用一块屏幕",
  "lobby.mode.manual": "传递链接",
  "lobby.mode.p2p": "实时联机",
  "lobby.mode.local.help": "一个浏览器带动整桌。它报出下一位是谁，然后等那个人把屏幕接过去。",
  "lobby.mode.manual.help":
    "每人一条自己的链接。走完自己的一步，把新链接交给下一位。不需要服务器，不需要账号，不在同一个网络里也能用。",
  "lobby.mode.p2p.help":
    "所有人打开同一条链接，浏览器之间直接通信。网络不允许时，自动退回到传递链接。",
  "lobby.youAre": "你是",
  "lobby.tooManyPlayers": "场上只有 {factions} 个阵营。",
  "lobby.poolTooBig": "那需要 {need} 个阵营；桌上只有 {left} 个。",
  "lobby.tooManyBans": "禁这么多，就没法给 {players} 位玩家每人留下一个阵营。",
  "lobby.factionNeeded": "要给 {players} 位玩家发出一份轮抽，就少不了它。",
  "lobby.start": "开始轮抽",
  "lobby.seed": "种子",
  "lobby.reroll": "换个种子",
  "lobby.reset": "恢复默认",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} 位玩家，桌上 {left} 个阵营——其中 {need} 个会发出去。",
  "feas.not-enough-factions":
    "{players} 位玩家加 {bans} 次禁用后只剩 {left} 个阵营。每位玩家至少要有一个。",
  "feas.faction-pool-too-large":
    "{players} 位玩家每人 {pool} 个阵营需要 {need} 个；桌上只有 {left} 个。每人最多能发 {max} 个。",
  "feas.hero-pool-too-large": "{faction} 只有 {have} 位英雄，所以每人 {pool} 位发不出来。最多 {max} 位。",
  "feas.not-enough-heroes": "英雄不够分：需要 {need} 位，只有 {have} 位。",
  "feas.fix": "修正",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "尚未开始",
  "phase.ban": "禁用",
  "phase.pick": "阵营与英雄",
  "phase.position": "座位",
  "phase.banHero": "禁英雄",
  "phase.faction": "阵营",
  "phase.hero": "英雄",
  "phase.done": "已抽完",
  "draft.seat": "玩家 {n}",
  "draft.turn": "轮到 {name}",
  "draft.yourTurn": "轮到你了",
  "draft.simultaneous": "所有人同时选",
  "draft.waiting": "等其他人",
  "draft.pickFaction": "选一个阵营",
  "draft.pickHero": "选一位英雄",
  "draft.banPrompt": "禁掉一个阵营",
  "draft.banHeroPrompt": "禁掉一位英雄",
  "draft.pickSeat": "选你坐哪儿",
  "draft.pickSeat.help": "正式开局时的行动顺序",
  "draft.seatFirst": "先手",
  "draft.seatNth": "第 {n} 位行动",
  "draft.kept": "不能禁",
  "draft.bansLeft": "还剩 {n} 次",
  "draft.bansProgress": "已用 {done}/{total}",
  "draft.dealtOne": "你拿到了 {faction}。",
  "draft.dealtOneHero": "你拿到了 {hero}。",
  "draft.confirm": "就要它",
  "draft.banned": "已禁用",
  "draft.taken": "已被拿走",
  "draft.undo": "撤销上一步",
  "draft.abandon": "放弃这次轮抽",
  "draft.abandon.confirm": "真要放弃？目前抽到的一切都会丢失。",
  "draft.abandon.yes": "是，放弃",
  "draft.abandon.no": "继续玩",
  "draft.abandon.shared":
    "这只结束了这边的轮抽。其他人手上仍有各自的副本，本页上的链接也照样能打开它。",
  "draft.hotseat": "把屏幕交给 {name}。",
  "draft.handover.copied": "他们的链接已在剪贴板里——粘给 {name}。",
  "draft.handover.manual": "复制下面的链接发给 {name}。",
  "draft.ready": "屏幕在我这儿",
  "draft.reveal": "亮出所有禁用",
  "draft.notOffered": "没有发给任何人",
  "draft.stats": "{name} 的攻击、防御、法力和知识",
  "draft.unreplayable":
    "保存的轮抽在这里重演不了——它可能是本页另一个版本写下的。重新开始会保留你的设置，别人给你的链接或代码也仍然能打开那次轮抽。",
  "draft.unreplayable.reset": "重新开始",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "在 wiki 上阅读 {name}",
  "wiki.faction": "在 wiki 上阅读 {name}",

  // ----------------------------------------------------------------- result
  "result.heading": "轮抽结果",
  "result.seat": "座位",
  "result.player": "玩家",
  "result.faction": "阵营",
  "result.hero": "英雄",
  "result.class": "职业",
  "result.might": "力量",
  "result.magic": "魔法",
  "result.copy": "复制为文本",
  "result.copied": "已复制",
  "result.print": "保存为 PDF",
  "result.again": "再抽一次",
  "result.newSetup": "更改设置",
  "result.code": "轮抽代码",
  "result.seed": "种子",
  "result.bans": "已禁阵营：{factions}",
  "result.heroBans": "已禁英雄：{heroes}",
  "result.nobans": "没有禁用",
  "result.showPassed": "显示没被选走的选项",
  "result.alsoOffered": "另外还提供：{options}",
  "result.specialty": "专长",
  "result.ability": "技能",

  // ------------------------------------------------------------------ share
  "share.code": "轮抽代码",
  "share.link": "链接",
  "share.room": "房间链接",
  "share.copy": "复制",
  "share.copied": "已复制",
  "share.qr": "二维码",
  "share.qrLoading": "正在生成…",
  "share.qrHelp": "用手机对准它，就能在手机上打开这次轮抽。",
  "share.seatLinks": "各玩家的链接",
  "share.handOver": "你这一步已记下。把这条链接发给 {name}。",
  "share.resume": "继续一次轮抽",
  "share.paste": "粘贴轮抽代码或链接",
  "share.open": "打开",
  "share.bad": "这个版本读不懂那段代码。",
  "share.badCatalogue": "那段代码是用另一份阵营清单生成的。",

  // ------------------------------------------------------------------ seats
  "claim.heading": "你是哪个座位？",
  "claim.free": "还什么都没抽",
  "claim.hidden": "藏到最后",
  "claim.taken": "这里已经有人了",
  "claim.orHotseat": "还是大家围一块屏幕？",
  "claim.hotseat": "用这个浏览器带整桌",

  // ------------------------------------------------------------------- live
  "live.off": "未连接",
  "live.connecting": "正在找其他人…",
  "live.online": "实时",
  "live.failed": "连不上",
  "live.with": "同场：{names}",
  "live.alone": "这里还没有别人",
  "live.dismiss": "关闭",
  "live.divergence.setup": "房间里有人打开了另一次轮抽。确认大家用的是同一条链接。",
  "live.divergence.state": "这个浏览器和另一个对轮抽的认知不一致。重新打开链接以接受对方的版本。",
  "live.divergence.seat": "有两个人坐在你的位置上。你们之中该有一位挪一挪。",
  "live.fallback": "连不上？那就互相传链接——它带着整次轮抽。",
};

export default zh;
