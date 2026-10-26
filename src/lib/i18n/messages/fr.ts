import type { Messages } from "./en";

/**
 * Français. Chaque clé manquante retombe toute seule sur l'anglais, donc un
 * catalogue partiel est une contribution parfaitement valable — ajoutez les
 * lignes que vous connaissez et laissez le reste.
 */
const fr: Partial<Messages> = {
  "app.title": "Draft multijoueur",
  "app.subtitle": "Heroes of Might & Magic III : le jeu de plateau",
  "lang.label": "Langue",
  "footer.more": "Mon travail vous plaît ? Allez voir :",
  "footer.cardCreator": "Créateur de cartes",
  "footer.editor": "Éditeur de scénarios",
  "footer.generator": "Générateur de scénarios aléatoires",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Préparer le draft",
  "lobby.players": "Joueurs",
  "lobby.format": "Format",
  "lobby.format.dealt": "Distribué",
  "lobby.format.snake": "Serpent",
  "lobby.format.dealt.help":
    "Un seul mélange donne à chaque joueur un lot que personne d'autre n'a reçu : tout le monde choisit en même temps et deux joueurs ne peuvent pas tomber sur la même faction.",
  "lobby.format.snake.help":
    "Chacun son tour, avec à chaque fois un nouvel échantillon de ce qui reste libre. À utiliser quand il n'y a pas assez de factions pour offrir un vrai choix à tout le monde.",
  "lobby.factionPool": "Factions proposées",
  "lobby.heroPool": "Héros proposés",
  "lobby.pool.forced": "pas de choix — la faction est distribuée",
  "lobby.pool.forcedHero": "pas de choix — le héros est distribué",
  "lobby.pool.all": "Tous",
  "lobby.pool.all.help":
    "Tous les héros qu'il reste à votre faction. Là où deux joueurs pourraient se voir proposer la même personne — Tarnum a une carte dans six factions — l'étape des héros fait le tour de la table un par un au lieu de tous à la fois.",
  "lobby.bans": "Bannissements de faction",
  "lobby.bans.none": "Aucun",
  "lobby.turns": "Tours",
  "lobby.turns.help": "La forme d'un tour, et si votre place à table vous revient.",
  "lobby.combined": "Faction et héros dans le même tour",
  "lobby.draftSeats": "Drafter l'ordre des places",
  "lobby.combined.help":
    "Un joueur prend sa faction puis le héros de cette faction avant que le suivant ne joue, un par un autour de la table. Désactivé, tout le monde drafte d'abord les factions, les héros ensuite.",
  "lobby.draftSeats.help":
    "Une fois tout le reste drafté, chacun choisit sa place parmi celles encore libres. Désactivé, c'est la graine qui décide.",
  "lobby.heroBans": "Bannissements de héros",
  "lobby.heroBans.help":
    "Dépensés dans un tour à part, après le draft des factions : tant qu'on ne sait pas qui joue quoi, bannir un héros revient à deviner. Un bannissement qui ne laisserait rien à drafter à quelqu'un est refusé.",
  "lobby.heroBans.blindHelp":
    "Avec faction et héros dans le même tour, il n'existe aucun moment où les villes sont connues et les héros pas encore : ces bannissements tombent avant tout le reste. On devine, on ne lit pas.",
  "lobby.banVisibility": "Les bannissements sont",
  "lobby.banVisibility.open": "Ouverts",
  "lobby.banVisibility.blind": "À l'aveugle",
  "lobby.banVisibility.open.help": "Un par un, sous les yeux de tous.",
  "lobby.banVisibility.blind.help":
    "Tout le monde bannit en même temps et les bannissements sont révélés ensemble. Deux joueurs peuvent dépenser un bannissement sur le même héros ou la même faction : il n'est retiré qu'une fois. Vaut pour les deux tours de bannissement.",
  "lobby.during": "Pendant le draft",
  "lobby.conceal": "Garder les choix cachés jusqu'au bout",
  "lobby.conceal.help":
    "Personne ne voit ce que les autres ont drafté ou banni avant la feuille finale — autour d'un seul écran, cela veut dire que personne ne voit rien entre deux tours. Ce qui est déjà parti reste visible sur le plateau, puisque vous ne pouvez pas le prendre.",
  "lobby.heroRule": "Les héros viennent de",
  "lobby.heroRule.own": "Votre propre faction",
  "lobby.heroRule.unique-faction": "N'importe laquelle, une chacun",
  "lobby.heroRule.any": "N'importe où",
  "lobby.heroRule.own.help": "Le héros que vous draftez appartient à la faction que vous avez draftée.",
  "lobby.heroRule.unique-faction.help":
    "Votre héros peut venir d'une faction que vous n'avez pas draftée, mais les héros de deux joueurs ne peuvent pas partager leur faction d'origine.",
  "lobby.heroRule.any.help": "N'importe quel héros de n'importe quelle faction.",
  "lobby.uniqueIdentity": "Un seul de chaque héros",
  "lobby.uniqueIdentity.help":
    "Tarnum a une carte dans six factions et Lord Haart dans deux. Avec ceci activé, un seul joueur peut être Tarnum.",
  "lobby.otherTowns": "Un héros peut venir de la ville d'un autre joueur",
  "lobby.otherTowns.combined":
    "Toujours actif avec faction et héros dans le même tour : le premier joueur prend un héros avant que le deuxième ait une ville, donc il n'y a pas encore d'autre ville dont s'écarter.",
  "lobby.sharedCards": "Une carte, deux héros",
  "lobby.sharedCards.help":
    "Les cartes de héros sont recto-verso : drafter une face prend la carte entière et le héros du dos part avec. Bannir, non — un bannissement prend le héros, pas la carte. Presque toutes les paires partagent une ville, donc cela se voit rarement sauf si les héros peuvent être draftés hors faction ; l'exception est Tarnum, dont les six cartes n'en font vraiment que trois.",
  "lobby.sharedCards.nodata":
    "Il faut la liste des héros qui partagent une carte, et elle n'est pas encore dans la base communautaire. Ajoutez les paires à CARD_PAIRS dans scripts/build-catalogue.mjs et cela s'activera.",
  "lobby.collection": "Votre collection",
  "lobby.collection.summary": "{factions} factions, {heroes} héros",
  "lobby.collection.all": "Toutes les boîtes",
  "lobby.collection.none": "Aucune boîte",
  "lobby.mode": "Jouer sur",
  "lobby.mode.local": "Un seul écran",
  "lobby.mode.manual": "Liens partagés",
  "lobby.mode.p2p": "En direct",
  "lobby.mode.local.help":
    "Un seul navigateur mène toute la table. Il annonce qui vient ensuite et attend que cette personne prenne l'écran.",
  "lobby.mode.manual.help":
    "Chacun reçoit son propre lien. Jouez votre coup, passez le nouveau lien au joueur suivant. Pas de serveur, pas de comptes, et cela marche même hors du même réseau.",
  "lobby.mode.p2p.help":
    "Tout le monde ouvre le même lien et les navigateurs se parlent directement. Retombe sur les liens à passer si le réseau bloque.",
  "lobby.youAre": "Vous êtes",
  "lobby.tooManyPlayers": "Il n'y a que {factions} factions en jeu.",
  "lobby.poolTooBig": "Il faudrait {need} factions ; il y en a {left} sur la table.",
  "lobby.tooManyBans":
    "Autant de bannissements ne laisserait pas une faction à chacun des {players} joueurs.",
  "lobby.factionNeeded": "Nécessaire pour distribuer un draft à {players} joueurs.",
  "lobby.start": "Lancer le draft",
  "lobby.seed": "Graine",
  "lobby.reroll": "Nouvelle graine",
  "lobby.reset": "Rétablir les valeurs par défaut",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} joueurs, {left} factions sur la table — {need} distribuées.",
  "feas.not-enough-factions":
    "{players} joueurs et {bans} bannissements laissent {left} factions. Il en faut au moins une par joueur.",
  "feas.faction-pool-too-large":
    "{players} joueurs à {pool} factions chacun demande {need} factions ; il y en a {left} sur la table. Le maximum distribuable est {max} chacun.",
  "feas.hero-pool-too-large":
    "{faction} a {have} héros, donc {pool} chacun est impossible à distribuer. Le maximum est {max}.",
  "feas.not-enough-heroes":
    "Il n'y a pas assez de héros pour tout le monde : {need} nécessaires, {have} disponibles.",
  "feas.fix": "Corriger",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Pas commencé",
  "phase.ban": "Bannissements",
  "phase.pick": "Faction et héros",
  "phase.position": "Places",
  "phase.banHero": "Bannissements de héros",
  "phase.faction": "Faction",
  "phase.hero": "Héros",
  "phase.done": "Drafté",
  "draft.seat": "Joueur {n}",
  "draft.turn": "Au tour de {name}",
  "draft.yourTurn": "À vous de jouer",
  "draft.simultaneous": "Tout le monde choisit en même temps",
  "draft.waiting": "En attente des autres",
  "draft.pickFaction": "Choisissez une faction",
  "draft.pickHero": "Choisissez un héros",
  "draft.banPrompt": "Bannissez une faction",
  "draft.banHeroPrompt": "Bannissez un héros",
  "draft.pickSeat": "Choisissez votre place",
  "draft.pickSeat.help": "L'ordre du tour pour la partie elle-même",
  "draft.seatFirst": "Commence",
  "draft.seatNth": "{n}e à jouer",
  "draft.kept": "Ne peut pas être banni",
  "draft.bansLeft": "{n} restant(s)",
  "draft.bansProgress": "{done} sur {total} dépensés",
  "draft.dealtOne": "Vous recevez {faction}.",
  "draft.dealtOneHero": "Vous recevez {hero}.",
  "draft.confirm": "Je le prends",
  "draft.banned": "Bannie",
  "draft.taken": "Prise",
  "draft.undo": "Annuler le dernier coup",
  "draft.abandon": "Abandonner le draft",
  "draft.abandon.confirm": "Abandonner ? Tout ce qui a été drafté est perdu.",
  "draft.abandon.yes": "Oui, abandonner",
  "draft.abandon.no": "Continuer",
  "draft.abandon.shared":
    "Cela ne met fin au draft qu'ici. Les autres gardent leur copie, et le lien de cette page l'ouvre toujours.",
  "draft.hotseat": "Passez l'écran à {name}.",
  "draft.handover.copied": "Leur lien est dans votre presse-papiers — collez-le pour {name}.",
  "draft.handover.manual": "Copiez le lien ci-dessous et envoyez-le à {name}.",
  "draft.ready": "J'ai l'écran",
  "draft.reveal": "Révéler les bannissements",
  "draft.notOffered": "Distribué à personne",
  "draft.stats": "Attaque, défense, puissance et savoir de {name}",
  "draft.unreplayable":
    "Le draft enregistré ne se rejoue pas ici — il a peut-être été écrit par une autre version de cette page. Recommencer conserve votre configuration, et un lien ou un code qu'on vous a donné ouvre toujours le draft lui-même.",
  "draft.unreplayable.reset": "Recommencer",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Lire sur {name} dans le wiki",
  "wiki.faction": "Lire sur {name} dans le wiki",

  // ----------------------------------------------------------------- result
  "result.heading": "Le draft",
  "result.seat": "Place",
  "result.player": "Joueur",
  "result.faction": "Faction",
  "result.hero": "Héros",
  "result.class": "Classe",
  "result.might": "Force",
  "result.magic": "Magie",
  "result.copy": "Copier en texte",
  "result.copied": "Copié",
  "result.print": "Enregistrer en PDF",
  "result.again": "Refaire un draft",
  "result.newSetup": "Changer la configuration",
  "result.code": "Code du draft",
  "result.bans": "Bannies : {factions}",
  "result.heroBans": "Héros bannis : {heroes}",
  "result.nobans": "Aucun bannissement",
  "result.showPassed": "Afficher les options écartées",
  "result.alsoOffered": "aussi proposé : {options}",
  "result.specialty": "Spécialité",
  "result.ability": "Capacité",

  // ------------------------------------------------------------------ share
  "share.code": "Code du draft",
  "share.link": "Lien",
  "share.room": "Lien du salon",
  "share.copy": "Copier",
  "share.copied": "Copié",
  "share.qr": "QR",
  "share.qrLoading": "Dessin en cours…",
  "share.qrHelp": "Pointez un téléphone dessus pour y ouvrir le draft.",
  "share.seatLinks": "Liens par joueur",
  "share.handOver": "Votre coup est joué. Envoyez ce lien à {name}.",
  "share.resume": "Reprendre un draft",
  "share.paste": "Collez un code ou un lien de draft",
  "share.open": "Ouvrir",
  "share.bad": "Cette version ne sait pas lire ce code.",
  "share.badCatalogue": "Ce code a été créé avec une autre liste de factions.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "Quelle place est la vôtre ?",
  "claim.free": "Rien de drafté pour l'instant",
  "claim.hidden": "Caché jusqu'au bout",
  "claim.taken": "Quelqu'un est là",
  "claim.orHotseat": "Plutôt tout le monde autour d'un seul écran ?",
  "claim.hotseat": "Utiliser ce navigateur pour toute la table",

  // ------------------------------------------------------------------- live
  "live.off": "Non connecté",
  "live.connecting": "Recherche des autres…",
  "live.online": "En direct",
  "live.failed": "Connexion impossible",
  "live.with": "avec {names}",
  "live.alone": "personne d'autre pour l'instant",
  "live.dismiss": "Fermer",
  "live.divergence.setup":
    "Quelqu'un dans ce salon a ouvert un autre draft. Vérifiez que vous êtes tous sur le même lien.",
  "live.divergence.state":
    "Ce navigateur et un autre ne sont pas d'accord sur le draft. Rouvrez le lien pour reprendre leur version.",
  "live.divergence.seat": "Deux personnes occupent votre place. L'une des deux devrait bouger.",
  "live.fallback": "Pas de connexion ? Passez-vous le lien — il porte tout le draft.",
};

export default fr;
