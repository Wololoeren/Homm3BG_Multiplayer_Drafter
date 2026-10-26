import type { Messages } from "./en";

/**
 * עברית. כל מפתח חסר נופל בעצמו חזרה לאנגלית, ולכן קטלוג חלקי הוא תרומה
 * מצוינת — הוסיפו את השורות שאתם יודעים והשאירו את השאר.
 *
 * זו השפה היחידה כאן שנקראת מימין לשמאל; ה־I18nProvider מגדיר dir="rtl"
 * כשהיא נבחרת.
 */
const he: Partial<Messages> = {
  "app.title": "דראפט לרב־משתתפים",
  "app.subtitle": "Heroes of Might & Magic III: משחק הלוח",
  "lang.label": "שפה",
  "footer.more": "אהבתם? הציצו גם ב:",
  "footer.cardCreator": "יוצר הקלפים",
  "footer.editor": "עורך התרחישים",
  "footer.generator": "מחולל תרחישים אקראיים",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "הגדרת הדראפט",
  "lobby.players": "שחקנים",
  "lobby.format": "פורמט",
  "lobby.format.dealt": "חלוקה",
  "lobby.format.snake": "נחש",
  "lobby.format.dealt.help":
    "ערבוב אחד נותן לכל שחקן מבחר שאיש אחר לא קיבל, כך שכולם בוחרים בו־זמנית ושני שחקנים לא יכולים לנחות על אותה סיעה.",
  "lobby.format.snake.help":
    "בתורות, שחקן אחד בכל פעם, כל אחד מקבל מדגם טרי ממה שעדיין פנוי. שימושי כשאין מספיק סיעות כדי לתת לכולם בחירה אמיתית.",
  "lobby.factionPool": "סיעות לבחירה",
  "lobby.heroPool": "גיבורים לבחירה",
  "lobby.pool.forced": "אין בחירה — הסיעה מחולקת",
  "lobby.pool.forcedHero": "אין בחירה — הגיבור מחולק",
  "lobby.pool.all": "הכול",
  "lobby.pool.all.help":
    "כל הגיבורים שנשארו לסיעה שלכם. במקום שבו שני שחקנים עלולים לקבל את אותה דמות — לטרנום יש קלף בשש סיעות — שלב הגיבורים עובר סביב השולחן אחד־אחד במקום כולם יחד.",
  "lobby.bans": "חסימות סיעה לשחקן",
  "lobby.bans.none": "אין",
  "lobby.turns": "תורות",
  "lobby.turns.help": "איך נראה תור, והאם המקום סביב השולחן נתון לבחירתכם.",
  "lobby.combined": "סיעה וגיבור באותו תור",
  "lobby.draftSeats": "לדראפט גם את סדר הישיבה",
  "lobby.combined.help":
    "שחקן לוקח את הסיעה שלו ומיד אחריה את הגיבור של אותה סיעה, לפני שהבא בתור זז — אחד־אחד סביב השולחן. כבוי: קודם כולם בוחרים סיעות, ואחר כך גיבורים.",
  "lobby.draftSeats.help":
    "אחרי שכל השאר נבחר, כל שחקן בוחר מקום מבין אלה שעוד פנויים. כבוי: הזרע מחליט.",
  "lobby.heroBans": "חסימות גיבור לשחקן",
  "lobby.heroBans.help":
    "מנוצלות בסבב נפרד, אחרי דראפט הסיעות — כל עוד לא יודעים מי משחק במה, חסימת גיבור היא ניחוש. חסימה שתשאיר מישהו בלי מה לבחור נדחית.",
  "lobby.heroBans.blindHelp":
    "כשסיעה וגיבור באים באותו תור אין רגע שבו הערים ידועות והגיבורים עוד לא — ולכן החסימות האלה נופלות לפני הכול. ניחוש, לא קריאה.",
  "lobby.banVisibility": "החסימות הן",
  "lobby.banVisibility.open": "גלויות",
  "lobby.banVisibility.blind": "עיוורות",
  "lobby.banVisibility.open.help": "אחת בכל פעם, לעיני כולם.",
  "lobby.banVisibility.blind.help":
    "כולם חוסמים בו־זמנית והחסימות נחשפות יחד. שני שחקנים יכולים להוציא חסימה על אותו גיבור או אותה סיעה, והיא תוסר רק פעם אחת. חל על שני סבבי החסימות.",
  "lobby.during": "במהלך הדראפט",
  "lobby.conceal": "להסתיר את הבחירות עד הסוף",
  "lobby.conceal.help":
    "אף אחד לא רואה מה האחרים בחרו או חסמו עד הדף שבסוף — סביב מסך אחד זה אומר שבין תור לתור איש אינו רואה דבר. מה שכבר נלקח עדיין מופיע על הלוח, כי ממילא אי אפשר לקחת אותו.",
  "lobby.heroRule": "הגיבורים מגיעים מ",
  "lobby.heroRule.own": "הסיעה שלכם",
  "lobby.heroRule.unique-faction": "כל סיעה, אחד לכל אחת",
  "lobby.heroRule.any": "מכל מקום",
  "lobby.heroRule.own.help": "הגיבור שאתם בוחרים שייך לסיעה שבחרתם.",
  "lobby.heroRule.unique-faction.help":
    "הגיבור שלכם יכול להגיע מסיעה שלא בחרתם, אבל הגיבורים של שני שחקנים לא יכולים לחלוק סיעת מוצא.",
  "lobby.heroRule.any.help": "כל גיבור מכל סיעה.",
  "lobby.uniqueIdentity": "אחד מכל גיבור",
  "lobby.uniqueIdentity.help":
    "לטרנום יש קלף בשש סיעות וללורד הארט בשתיים. כשזה דלוק, רק שחקן אחד יכול להיות טרנום.",
  "lobby.otherTowns": "גיבור יכול להגיע מהעיר של שחקן אחר",
  "lobby.otherTowns.combined":
    "תמיד דלוק כשסיעה וגיבור באים באותו תור: השחקן הראשון לוקח גיבור לפני שלשני יש עיר, ולכן אין עדיין עיר אחרת להתרחק ממנה.",
  "lobby.sharedCards": "קלף אחד, שני גיבורים",
  "lobby.sharedCards.help":
    "קלפי הגיבורים דו־צדדיים, ולכן בחירה בצד אחד לוקחת את הקלף כולו והגיבור שבגב הולך איתו. חסימה לא — היא לוקחת את הגיבור, לא את הקלף. כמעט כל זוג חולק עיר, ולכן זה נושך לעיתים רחוקות אלא אם מותר לבחור גיבורים מחוץ לסיעה; היוצא מן הכלל הוא טרנום, ששת הקלפים שלו הם למעשה שלושה.",
  "lobby.sharedCards.nodata":
    "צריך לשם כך את הרשימה של אילו גיבורים חולקים קלף, והיא עדיין לא במסד הנתונים הקהילתי. הוסיפו את הזוגות ל־CARD_PAIRS בקובץ scripts/build-catalogue.mjs וזה יידלק.",
  "lobby.collection": "האוסף שלכם",
  "lobby.collection.summary": "{factions} סיעות, {heroes} גיבורים",
  "lobby.collection.all": "כל הקופסאות",
  "lobby.collection.none": "אף קופסה",
  "lobby.mode": "משחקים על",
  "lobby.mode.local": "מסך אחד",
  "lobby.mode.manual": "קישורים מועברים",
  "lobby.mode.p2p": "בשידור חי",
  "lobby.mode.local.help":
    "דפדפן אחד מנהל את כל השולחן. הוא אומר מי הבא בתור ומחכה שאותו אדם ייקח את המסך.",
  "lobby.mode.manual.help":
    "כל אחד מקבל קישור משלו. עשו את המהלך, והעבירו את הקישור החדש לשחקן הבא. בלי שרת, בלי חשבונות, ועובד גם אם אינכם באותה רשת.",
  "lobby.mode.p2p.help":
    "כולם פותחים את אותו קישור והדפדפנים מדברים ביניהם ישירות. אם הרשת חוסמת, חוזרים להעברת קישורים.",
  "lobby.youAre": "אתם",
  "lobby.tooManyPlayers": "יש במשחק רק {factions} סיעות.",
  "lobby.poolTooBig": "לשם כך נדרשות {need} סיעות; על השולחן יש {left}.",
  "lobby.tooManyBans": "כל כך הרבה חסימות לא ישאירו סיעה לכל אחד מ־{players} השחקנים.",
  "lobby.factionNeeded": "נחוצה כדי לחלק דראפט ל־{players} שחקנים.",
  "lobby.start": "התחילו את הדראפט",
  "lobby.seed": "זרע",
  "lobby.reroll": "זרע חדש",
  "lobby.reset": "איפוס לברירות המחדל",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} שחקנים, {left} סיעות על השולחן — {need} מהן מחולקות.",
  "feas.not-enough-factions":
    "{players} שחקנים ו־{bans} חסימות משאירים {left} סיעות. צריכה להיות לפחות אחת לכל שחקן.",
  "feas.faction-pool-too-large":
    "{players} שחקנים עם {pool} סיעות לכל אחד דורשים {need} סיעות; על השולחן יש {left}. אפשר לחלק לכל היותר {max} לכל אחד.",
  "feas.hero-pool-too-large":
    "ל{faction} יש {have} גיבורים, ולכן אי אפשר לחלק {pool} לכל אחד. המקסימום הוא {max}.",
  "feas.not-enough-heroes": "אין מספיק גיבורים לכולם: נדרשים {need}, זמינים {have}.",
  "feas.fix": "לתקן",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "טרם התחיל",
  "phase.ban": "חסימות",
  "phase.pick": "סיעה וגיבור",
  "phase.position": "מקומות",
  "phase.banHero": "חסימות גיבורים",
  "phase.faction": "סיעה",
  "phase.hero": "גיבור",
  "phase.done": "הדראפט הסתיים",
  "draft.seat": "שחקן {n}",
  "draft.turn": "תורו של {name}",
  "draft.yourTurn": "תורכם",
  "draft.simultaneous": "כולם בוחרים בו־זמנית",
  "draft.waiting": "ממתינים לאחרים",
  "draft.pickFaction": "בחרו סיעה",
  "draft.pickHero": "בחרו גיבור",
  "draft.banPrompt": "חסמו סיעה",
  "draft.banHeroPrompt": "חסמו גיבור",
  "draft.pickSeat": "בחרו היכן לשבת",
  "draft.pickSeat.help": "סדר התורות במשחק עצמו",
  "draft.seatFirst": "פותח",
  "draft.seatNth": "{n} בתור",
  "draft.kept": "אי אפשר לחסום",
  "draft.bansLeft": "נותרו {n}",
  "draft.bansProgress": "{done} מתוך {total} נוצלו",
  "draft.dealtOne": "קיבלתם את {faction}.",
  "draft.dealtOneHero": "קיבלתם את {hero}.",
  "draft.confirm": "לוקחים",
  "draft.banned": "חסומה",
  "draft.taken": "תפוסה",
  "draft.undo": "בטלו את המהלך האחרון",
  "draft.abandon": "נטישת הדראפט",
  "draft.abandon.confirm": "לנטוש? כל מה שנבחר עד עכשיו יאבד.",
  "draft.abandon.yes": "כן, לנטוש",
  "draft.abandon.no": "ממשיכים לשחק",
  "draft.abandon.shared":
    "זה מסיים את הדראפט רק כאן. לכל האחרים עדיין יש עותק משלהם, והקישור שבדף הזה עדיין פותח אותו.",
  "draft.hotseat": "העבירו את המסך אל {name}.",
  "draft.handover.copied": "הקישור שלהם כבר בלוח — הדביקו אותו עבור {name}.",
  "draft.handover.manual": "העתיקו את הקישור שלמטה ושלחו אותו אל {name}.",
  "draft.ready": "המסך אצלי",
  "draft.reveal": "חשפו את החסימות",
  "draft.notOffered": "לא חולק לאיש",
  "draft.stats": "התקפה, הגנה, עוצמת כישוף וידע של {name}",
  "draft.unreplayable":
    "הדראפט השמור לא מתנגן כאן — ייתכן שנכתב בגרסה אחרת של הדף. התחלה מחדש שומרת על ההגדרות שלכם, וקישור או קוד שקיבלתם עדיין יפתחו את הדראפט עצמו.",
  "draft.unreplayable.reset": "להתחיל מחדש",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "קראו על {name} בוויקי",
  "wiki.faction": "קראו על {name} בוויקי",

  // ----------------------------------------------------------------- result
  "result.heading": "הדראפט",
  "result.seat": "מקום",
  "result.player": "שחקן",
  "result.faction": "סיעה",
  "result.hero": "גיבור",
  "result.class": "מחלקה",
  "result.might": "עוצמה",
  "result.magic": "קסם",
  "result.copy": "העתיקו כטקסט",
  "result.copied": "הועתק",
  "result.print": "שמרו כ־PDF",
  "result.again": "דראפט נוסף",
  "result.newSetup": "שינוי ההגדרות",
  "result.code": "קוד הדראפט",
  "result.bans": "נחסמו: {factions}",
  "result.heroBans": "גיבורים שנחסמו: {heroes}",
  "result.nobans": "ללא חסימות",
  "result.specialty": "התמחות",
  "result.ability": "יכולת",

  // ------------------------------------------------------------------ share
  "share.code": "קוד הדראפט",
  "share.link": "קישור",
  "share.room": "קישור לחדר",
  "share.copy": "העתיקו",
  "share.copied": "הועתק",
  "share.qr": "QR",
  "share.qrLoading": "מצייר…",
  "share.qrHelp": "כוונו אליו טלפון כדי לפתוח שם את הדראפט.",
  "share.seatLinks": "קישור לכל שחקן",
  "share.handOver": "המהלך שלכם נרשם. שלחו את הקישור הזה אל {name}.",
  "share.resume": "המשך דראפט",
  "share.paste": "הדביקו קוד או קישור של דראפט",
  "share.open": "פתחו",
  "share.bad": "את הקוד הזה הגרסה הנוכחית לא יודעת לקרוא.",
  "share.badCatalogue": "הקוד הזה נוצר עם רשימת סיעות אחרת.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "איזה מקום שלכם?",
  "claim.free": "עוד לא נבחר דבר",
  "claim.hidden": "מוסתר עד הסוף",
  "claim.taken": "כבר יושב כאן מישהו",
  "claim.orHotseat": "אולי בכל זאת כולם סביב מסך אחד?",
  "claim.hotseat": "השתמשו בדפדפן הזה לכל השולחן",

  // ------------------------------------------------------------------- live
  "live.off": "לא מחובר",
  "live.connecting": "מחפש את האחרים…",
  "live.online": "חי",
  "live.failed": "ההתחברות נכשלה",
  "live.with": "עם {names}",
  "live.alone": "אין כאן עדיין אף אחד אחר",
  "live.dismiss": "סגירה",
  "live.divergence.setup": "מישהו בחדר הזה פתח דראפט אחר. בדקו שלכולכם יש אותו קישור.",
  "live.divergence.state":
    "הדפדפן הזה ודפדפן אחר חלוקים לגבי הדראפט. פתחו את הקישור מחדש כדי לאמץ את הגרסה שלהם.",
  "live.divergence.seat": "שני אנשים יושבים במקום שלכם. אחד מכם צריך לזוז.",
  "live.fallback": "לא מתחבר? העבירו ביניכם את הקישור — הוא נושא את כל הדראפט.",
};

export default he;
