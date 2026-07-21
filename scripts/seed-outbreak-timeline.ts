/**
 * Импорт хронологии вспышки на Хайнане → DCD → послевоенный период.
 * Идемпотентно: повторный запуск пропускает уже созданные записи по имени.
 *
 *   npx tsx scripts/seed-outbreak-timeline.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function ensureFaction(name: string, data: { description?: string; foundedDate?: string; colorScheme?: string }) {
  const existing = await prisma.faction.findUnique({ where: { name } });
  if (existing) return existing;
  return prisma.faction.create({
    data: {
      name,
      description: data.description,
      foundedDate: data.foundedDate,
      colorScheme: data.colorScheme ?? JSON.stringify({ primary: "emerald", secondary: "slate" }),
    },
  });
}

async function ensureOrg(name: string, data: { description?: string; foundedDate?: string }) {
  const existing = await prisma.organization.findUnique({ where: { name } });
  if (existing) return existing;
  return prisma.organization.create({ data: { name, ...data } });
}

async function ensureLocation(name: string, data: {
  type?: string;
  coordX: number;
  coordY: number;
  population?: string;
  description?: string;
  accessLevel?: number;
}) {
  const existing = await prisma.location.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.location.create({
    data: {
      name,
      type: data.type ?? "city",
      coordX: data.coordX,
      coordY: data.coordY,
      population: data.population,
      description: data.description,
      accessLevel: data.accessLevel ?? 0,
    },
  });
}

async function ensureCharacter(name: string, data: {
  isSecondary?: boolean;
  callsign?: string;
  rank?: string;
  status?: string;
  description?: string;
  accessLevel?: number;
  factionId?: string;
  organizationId?: string;
}) {
  const existing = await prisma.character.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.character.create({
    data: {
      name,
      isSecondary: data.isSecondary ?? false,
      callsign: data.callsign,
      rank: data.rank,
      status: data.status ?? "Архив",
      description: data.description,
      accessLevel: data.accessLevel ?? 0,
      factionId: data.factionId,
      organizationId: data.organizationId,
    },
  });
}

async function ensureEvent(name: string, data: {
  date: string;
  description: string;
  cause?: string;
  consequences?: string;
  accessLevel?: number;
  locationIds?: string[];
  documentIds?: string[];
}) {
  const existing = await prisma.event.findFirst({ where: { name } });
  if (existing) return existing;
  const event = await prisma.event.create({
    data: {
      name,
      date: data.date,
      description: data.description,
      cause: data.cause,
      consequences: data.consequences,
      accessLevel: data.accessLevel ?? 0,
    },
  });
  for (const locationId of data.locationIds ?? []) {
    await prisma.eventLocation.create({ data: { eventId: event.id, locationId } });
  }
  for (const documentId of data.documentIds ?? []) {
    await prisma.eventDocument.create({ data: { eventId: event.id, documentId } });
  }
  return event;
}

async function ensureDocument(title: string, data: {
  type?: string;
  content: string;
  accessLevel?: number;
  damagePercent?: number;
}) {
  const existing = await prisma.document.findFirst({ where: { title } });
  if (existing) return existing;
  return prisma.document.create({
    data: {
      title,
      type: data.type ?? "report",
      content: data.content,
      accessLevel: data.accessLevel ?? 0,
      damagePercent: data.damagePercent ?? 0,
    },
  });
}

async function ensureDialogue(title: string, data: {
  kind: string;
  summary?: string;
  accessLevel?: number;
  locationId?: string;
  aboutLocationId?: string;
  factionId?: string;
  lines: { speakerId?: string; speakerLabel?: string; text: string }[];
}) {
  const existing = await prisma.dialogue.findFirst({ where: { title } });
  if (existing) return existing;
  return prisma.dialogue.create({
    data: {
      title,
      kind: data.kind,
      summary: data.summary,
      accessLevel: data.accessLevel ?? 0,
      locationId: data.locationId,
      aboutLocationId: data.aboutLocationId,
      factionId: data.factionId,
      lines: {
        create: data.lines.map((l, i) => ({
          speakerId: l.speakerId,
          speakerLabel: l.speakerLabel,
          text: l.text,
          sortOrder: i,
        })),
      },
    },
  });
}

async function ensureUnlock(title: string, data: {
  grantsLevel: number;
  cipherText: string;
  solutionKey: string;
  rewardCode: string;
  hint?: string;
  dialogueId?: string;
  documentId?: string;
}) {
  const existing = await prisma.clearanceUnlock.findFirst({ where: { title } });
  if (existing) return existing;
  return prisma.clearanceUnlock.create({ data: { title, ...data } });
}

async function main() {
  console.log("→ Фракции и организации…");
  const dcdFaction = await ensureFaction("DCD", {
    description:
      "Disease Containment Department — департамент по сдерживанию заболевания. Армия, наука и гуманитарная структура в одном корпусе.",
    foundedDate: "2029-02",
    colorScheme: JSON.stringify({ primary: "emerald", secondary: "zinc" }),
  });
  const infectedFaction = await ensureFaction("Заражённые", {
    description: "Мутировавшие особи и колонии. После появления Координаторов — организованная биологическая угроза.",
    colorScheme: JSON.stringify({ primary: "purple", secondary: "gray" }),
  });
  const dcdOrg = await ensureOrg("DCD", {
    description: "Официальная структура США, выросшая из добровольческих отрядов первых месяцев пандемии.",
    foundedDate: "2029-02",
  });

  console.log("→ Локации…");
  const hainan = await ensureLocation("Хайнань", {
    type: "contaminationZone",
    coordX: 19.2,
    coordY: 109.7,
    description:
      "Остров в Южно-Китайском море. Эпицентр первой зарегистрированной вспышки мутаций в августе 2028 года. Позднее — полная блокада.",
    accessLevel: 0,
  });
  const haikou = await ensureLocation("Хайкоу", {
    type: "city",
    coordX: 20.04,
    coordY: 110.35,
    population: "~2 млн (до 2028)",
    description:
      "Административный центр Хайнаня. Ночь 25–26 августа 2028: первые массовые вызовы в полицию из окрестных деревень.",
  });
  const sanya = await ensureLocation("Санья", {
    type: "city",
    coordX: 18.25,
    coordY: 109.5,
    population: "~1 млн (до 2028)",
    description: "Юг острова. Вторая ночь вспышки: одновременные нападения в десятках населённых пунктов.",
  });
  const nyc = await ensureLocation("Нью-Йорк", {
    type: "city",
    coordX: 40.71,
    coordY: -74.0,
    description: "Место «Нью-Йоркской резни» (2049). Расследование засекречено.",
    accessLevel: 2,
  });

  console.log("→ Второстепенные спикеры (диспетчеры, очевидцы)…");
  const opChen = await ensureCharacter("Оператор Чэнь", {
    isSecondary: true,
    rank: "Диспетчер",
    status: "Архив",
    description: "Смена 02:00–08:00, диспетчерская полиции Хайкоу. 26.08.2028.",
  });
  const opWei = await ensureCharacter("Оператор Вэй", {
    isSecondary: true,
    rank: "Диспетчер",
    status: "Архив",
    description: "Координация патрулей северного сектора Хайнаня.",
  });
  const callerLi = await ensureCharacter("Житель Ли (звонок)", {
    isSecondary: true,
    status: "Пропал",
    description: "Житель деревни у подножия гор севернее Хайкоу. Звонок 26.08.2028, 00:17.",
  });
  const callerZhou = await ensureCharacter("Жительница Чжоу", {
    isSecondary: true,
    status: "Пропала",
    description: "Сообщила о нападении у соседнего дома. Связь оборвалась.",
  });
  const patrol07 = await ensureCharacter("Патруль HNK-07", {
    isSecondary: true,
    callsign: "HNK-07",
    rank: "Патруль",
    status: "Связь потеряна",
    description: "Первый экипаж, вошедший в зону. Последнее сообщение — запрос подкрепления.",
  });
  const patrol12 = await ensureCharacter("Патруль HNK-12", {
    isSecondary: true,
    callsign: "HNK-12",
    rank: "Патруль",
    status: "Связь потеряна",
  });
  const opSanya = await ensureCharacter("Оператор Фан", {
    isSecondary: true,
    rank: "Диспетчер",
    status: "Архив",
    description: "Диспетчерская Санья, вторая ночь.",
  });
  const medic = await ensureCharacter("Медсестра Хуан", {
    isSecondary: true,
    rank: "Медперсонал",
    status: "Неизвестно",
    description: "Городская больница №3, Хайкоу. Запись внутреннего канала.",
  });
  const doctor = await ensureCharacter("Др. Гао", {
    isSecondary: true,
    rank: "Хирург",
    status: "Неизвестно",
    description: "Дежурный хирург. Фиксировал первые человеческие мутации.",
  });

  console.log("→ Документы…");
  const docDawn = await ensureDocument("Сводка на рассвете — Хайнань", {
    type: "report",
    accessLevel: 0,
    content: `ОФИЦИАЛЬНАЯ СВОДКА // ПРОВИНЦИЯ ХАЙНАНЬ
Дата: 26 августа 2028, 06:40

К рассвету подтверждено уничтожение:
• 177 мутировавших особей, внешне напоминающих волков
• 30 заражённых домашних свиней с аналогичными признаками

Примечание аналитиков: естественная популяция волков на острове отсутствовала десятилетиями. Происхождение особей неизвестно.

Режим ЧС введён в 04:00. В район направлены вооружённая полиция и военные подразделения.`,
  });

  const docHospital = await ensureDocument("Медпротокол: первые заражённые люди", {
    type: "medical",
    accessLevel: 2,
    content: `ВНУТРЕННИЙ ПРОТОКОЛ // БОЛЬНИЦА №3 ХАЙКОУ
27–28 августа 2028

После госпитализации пострадавших с укусами и рваными ранами у части пациентов зафиксирован единый паттерн:
1. Резкий подъём температуры
2. Нестабильный сердечный ритм, судороги, кровоизлияния
3. Стремительное разрушение тканей
4. Изменение поведения → мутация в течение минут

Большинство погибало вскоре после завершения мутации. Выжившие немедленно атаковали персонал и других пациентов.

К концу вторых суток несколько больниц потеряли контроль над отделениями.

Ключ архивиста (служебная пометка): карантинный`,
  });

  const docQuarantine = await ensureDocument("Указ о блокаде острова Хайнань", {
    type: "decree",
    accessLevel: 1,
    content: `ЦЕНТРАЛЬНОЕ ПРАВИТЕЛЬСТВО КНР
УКАЗ О ВОЕННОМ ПОЛОЖЕНИИ И КАРАНТИНЕ

Остров Хайнань полностью изолирован.
Морские перевозки прекращены. Аэропорты закрыты. Гражданское авиасообщение остановлено.
Блокада: въезд и выезд только по специальному разрешению.

Официальная формулировка: вспышка неизвестной особо опасной инфекции.`,
  });

  const docDcd = await ensureDocument("Регистрация DCD — февраль 2029", {
    type: "report",
    accessLevel: 0,
    content: `СОЕДИНЁННЫЕ ШТАТЫ АМЕРИКИ
Disease Containment Department (DCD)

Официально зарегистрирован в феврале 2029 года на базе добровольческих отрядов первых месяцев пандемии.

Структура включает:
• боевые подразделения быстрого реагирования
• научно-исследовательские комплексы
• инженерные и строительные батальоны
• медицинские службы
• разведку
• спецгруппы по изучению новых форм заражённых

Фактически — армия, наука и гуманитарная структура одновременно.`,
  });

  const docCoordinators = await ensureDocument("Досье: Координаторы", {
    type: "classified",
    accessLevel: 3,
    damagePercent: 15,
    content: `DCD / РАЗВЕДЫВАТЕЛЬНЫЙ ОТДЕЛ
Классификация: СОВЕРШЕННО СЕКРЕТНО
Год признания: 2036

Координаторы — мутировавшие особи с развитым интеллектом.
Способны управлять поведением обычных заражённых.
Вокруг них формируются колонии: гнёзда, охрана, запасы пищи.
Отдельные колонии — десятки тысяч особей.

Вывод: угроза перешла из категории эпидемии в категорию коллективной биологической жизни.

[фрагмент повреждён]
…носители нулевой стадии… засекречено…
служебный код: судия`,
  });

  const docTwelve = await ensureDocument("Инцидент «Двенадцать» — предварительный отчёт", {
    type: "classified",
    accessLevel: 4,
    damagePercent: 40,
    content: `17 марта 2048
Одновременные взрывы на двенадцати исследовательских объектах DCD (Северная Америка).
Связь со всеми лабораториями потеряна в течение суток.

Новый класс заражённых: «Судья».
Превосходит Координаторов по интеллекту и физическим возможностям.
Способность управлять группами на расстоянии; отдельные отчёты — сохранение человеческих воспоминаний.

Причина взрывов: диверсия / саботаж / эксперимент — не установлено.

[████████████████]
Дригур — упоминание в подпольных сетях после Нью-Йорка, 2049. Не подтверждено.`,
  });

  console.log("→ События хронологии…");
  await ensureEvent("Первое появление заражённых", {
    date: "2028-08-26",
    accessLevel: 0,
    locationIds: [hainan.id, haikou.id],
    documentIds: [docDawn.id],
    cause: "Неизвестный возбудитель. Источник популяции «волков» на острове не установлен.",
    consequences: "ЧС провинции. Первые потери патрулей. Официально: 177 мутировавших волков, 30 свиней.",
    description: `В ночь с 25 на 26 августа 2028 года диспетчерские службы полиции у Хайкоу начали получать десятки необычных вызовов из деревень в гористой местности. Жители сообщали о неизвестных животных у домов: тяжёлые шаги, царапанье по стенам, вой и рычание, не похожие ни на одного известного хищника. Часть очевидцев описывала крупных существ, напоминающих волков — хотя волки на острове не обитали десятилетиями.

За часы число обращений выросло в несколько раз. К сообщениям о животных добавились нападения на людей, крики, выстрелы из охотничьих ружей и пропажа связи с соседними домами.

Первые патрули прибыли около двух часов ночи. Уже в первые минуты стало ясно: это не обычные хищники и не вооружённые преступники. Существа напоминали волков, но с гипертрофированной мускулатурой, удлинёнными передними лапами, увеличенными когтями и неестественно вытянутыми зубами. В местах отсутствовала шерсть — открывались мышцы и деформированные кости. Животные почти не реагировали на боль и атаковали без отступления.

Несколько особей удалось уничтожить, но связь с экипажами пропала. Последними сообщениями были короткие запросы подкрепления и бессвязные крики.

Около четырёх утра провинция ввела ЧС. К рассвету официально сообщалось об уничтожении 177 мутировавших волков и 30 заражённых свиней.`,
  });

  await ensureEvent("Вторая ночь — Санья", {
    date: "2028-08-27",
    accessLevel: 0,
    locationIds: [hainan.id, sanya.id],
    consequences: "670 гражданских, 70 полицейских, 40 работников экстренных служб погибшими к утру.",
    description: `Следующей ночью вспышка охватила юг острова у Санья. Нападения шли почти одновременно в десятках населённых пунктов.

Мутация затронула не только «волков»: собаки, свиньи, кабаны, обезьяны, крупные птицы — у всех схожие изменения тела, рост мышечной массы, деформация конечностей, крайняя агрессия. Животные нападали группами, игнорируя ранения.

К утру официальные потери: 670 гражданских, 70 сотрудников полиции, 40 работников экстренных служб.`,
  });

  await ensureEvent("Первые заражённые люди", {
    date: "2028-08-28",
    accessLevel: 2,
    locationIds: [haikou.id, sanya.id],
    documentIds: [docHospital.id],
    cause: "Укусы и контакт с мутировавшими животными.",
    consequences: "Потеря контроля над несколькими больницами к концу вторых суток.",
    description: `Больницы Хайкоу, Санья и ближайших городов были переполнены пострадавшими. Врачи сначала связывали ухудшение с инфекцией, кровопотерей и шоком.

Через несколько часов часть пациентов демонстрировала одинаковые симптомы: жар, нестабильный ритм, судороги, кровоизлияния, разрушение тканей, изменение поведения — затем быстрая мутация. Кости ломались, мышцы рвались, органы получали критические повреждения. Большинство погибало за минуты. Выжившие сразу нападали на окружающих.

К концу вторых суток несколько больниц полностью потеряли контроль.`,
  });

  await ensureEvent("Карантин Хайнаня", {
    date: "2028-08-29",
    accessLevel: 0,
    locationIds: [hainan.id],
    documentIds: [docQuarantine.id],
    consequences: "Полная блокада острова. Военное положение.",
    description: `Центральное правительство Китая полностью изолировало Хайнань. Военное положение. Морские перевозки прекращены, аэропорты закрыты, гражданское авиасообщение остановлено. Военные организовали блокаду: въезд и выезд только по спецразрешению.

Официальная причина: вспышка неизвестной особо опасной инфекции.`,
  });

  await ensureEvent("Первая неделя карантина", {
    date: "2028-09-02",
    accessLevel: 1,
    locationIds: [hainan.id],
    consequences: "~1500 погибших, ~500 пропавших без вести. Населённые пункты выпадают из радиоэфира.",
    description: `За первую неделю карантина погибло около 1500 человек. Ещё 500 официально признаны пропавшими без вести.

Поисковые группы неоднократно отправлялись в районы последних сообщений — многие сами переставали выходить на связь. Иногда находили лишь брошенную технику, оружие и следы столкновений. Несколько населённых пунктов полностью исчезли из радиоэфира.`,
  });

  await ensureEvent("Информационная блокада", {
    date: "2028-09",
    accessLevel: 0,
    locationIds: [hainan.id],
    description: `Государственные СМИ КНР почти не освещали происходящее — только «чрезвычайная санитарная ситуация» и временный карантин.

Записи с камер, телефонов, регистраторов и прямые трансляции очевидцев всё равно утекли в сеть в первые дни. Цензура не остановила распространение на зарубежных площадках. Эксперты сначала считали материалы подделкой; позже стало ясно, что события реальны.`,
  });

  await ensureEvent("Первый месяц карантина", {
    date: "2028-09-26",
    accessLevel: 1,
    locationIds: [hainan.id],
    consequences: "Официально 3400 погибших; реальные потери выше. Сельская местность вне контроля.",
    description: `За месяц несколько деревень были полностью уничтожены. Спасательные операции прерывали из-за невозможности обеспечить безопасность личного состава.

Официально: 3400 погибших. Реальные потери оценивались выше. Вооружённые силы удерживали крупные города и узлы, но значительная часть сельской местности фактически вышла из-под контроля государства.`,
  });

  await ensureEvent("Распространение на материк", {
    date: "2028-10",
    accessLevel: 0,
    locationIds: [hainan.id],
    cause: "Совпадение по времени исключает случайность.",
    consequences: "Вспышки в 23 прибрежных районах Китая. Заражение покинуло Хайнань.",
    description: `Практически одновременно в 23 прибрежных районах Китая зарегистрированы новые нападения животных и первые случаи аналогичных мутаций у людей. Совпадение во времени исключало случайность и указывало на более широкое распространение возбудителя.

Стало очевидно: заражение уже покинуло пределы Хайнаня.`,
  });

  await ensureEvent("Международная реакция ООН", {
    date: "2028-11",
    accessLevel: 0,
    consequences: "Международные подразделения прибыли лишь спустя ~1,5 месяца — ситуация уже вышла из-под контроля.",
    description: `На фоне ранее произошедшей «Нью-Йоркской резни» мировое сообщество восприняло события в Китае как угрозу международного масштаба.

Экстренное заседание ООН завершилось предложением направить специалистов, военных медиков и гуманитарную помощь. Из-за политики и обстановки первые международные подразделения прибыли лишь спустя полтора месяца. К тому моменту ситуация уже вышла из-под контроля.`,
  });

  await ensureEvent("Китай потерян на 75%", {
    date: "2029-02",
    accessLevel: 1,
    consequences: "Локальная катастрофа стала глобальной пандемией.",
    description: `Через шесть месяцев после первых случаев около 75% территории Китая считалось полностью потерянной. Крупные города разрушены или изолированы. Централизованное управление сохранилось лишь в отдельных регионах.

Одновременно аналогичные вспышки фиксировались в разных странах мира. Локальная катастрофа окончательно превратилась в глобальную пандемию.`,
  });

  await ensureEvent("Формирование нового мира", {
    date: "2029-01",
    accessLevel: 0,
    description: `К началу 2029 года обычные карантинные меры уже не останавливали инфекцию. Разрушение инфраструктуры: электричество, связь, логистика. Миллионы бежали в охраняемые зоны.

Человечество начало адаптироваться: военные, добровольцы и научные организации искали способы борьбы и изучали природу заражённых.`,
  });

  await ensureEvent("Создание DCD", {
    date: "2029-02",
    accessLevel: 0,
    documentIds: [docDcd.id],
    locationIds: [],
    consequences: "DCD — одна из крупнейших структур на планете в течение двух лет.",
    description: `В феврале 2029 правительство США официально зарегистрировало DCD (Disease Containment Department).

Изначально — сеть добровольческих отрядов первых месяцев пандемии: эвакуация, конвои, зачистка зон. Эффективность привлекла федеральные власти: финансирование, военные ресурсы, исследовательские центры, разведка.

За два года DCD стала армией, научной организацией и гуманитарной структурой одновременно.`,
  });

  await ensureEvent("Великая зачистка", {
    date: "2030–2038",
    accessLevel: 0,
    consequences: "~69% населения Земли погибло к 2038. Зоны полного карантина на нескольких континентах.",
    description: `С 2030 по 2038 человечество переломило ход войны: новые методы обнаружения, оружие, изучение инфекции. Значительная часть территорий возвращена под контроль.

Цена: по данным Международного Совета Восстановления, к 2038 погибло около 69% населения Земли. Целые государства исчезли. Сотни городов — руины. Огромные территории Азии, Африки, Южной Америки и Европы объявлены зонами полного карантина.

Инфекция продолжала изменяться.`,
  });

  await ensureEvent("Эволюция заражённых", {
    date: "2030-е",
    accessLevel: 2,
    locationIds: [],
    description: `Возбудитель показал крайне высокую адаптацию. Каждое поколение отличалось: скорость, костный каркас, регенерация.

Впервые появились случаи организованного поведения: засады, ложные отступления, окружение поселений. Первоначально это считали ошибками наблюдений. Дальнейшие исследования подтвердили новый класс заражённых.`,
  });

  await ensureEvent("Признание Координаторов", {
    date: "2036",
    accessLevel: 3,
    documentIds: [docCoordinators.id],
    consequences: "Угроза классифицирована как коллективная биологическая жизнь.",
    description: `В 2036 DCD официально признала существование Координаторов — сильно мутировавших особей с развитым интеллектом, способных управлять другими заражёнными.

Перехваты с БПЛА показывали организованность обычных мутантов рядом с ними. Обнаружены колонии: гнёзда, охрана, запасы пищи. Крупнейшие — десятки тысяч особей.`,
  });

  await ensureEvent("Носители нулевой стадии", {
    date: "2040",
    accessLevel: 3,
    consequences: "Исследования засекречены DCD.",
    description: `На территориях бывшей Канады и северных штатов США обнаружены люди с вирусом в организме, но без мутации. Часть — повышенная выносливость, ускоренное заживление, сильный иммунитет.

В официальных документах: «носители нулевой стадии». Большая часть исследований засекречена.`,
  });

  await ensureEvent("Операция «Новый Рассвет»", {
    date: "2042-07",
    accessLevel: 0,
    consequences: "Американский континент свободен от крупных колоний. Локальные очаги — спецподразделениям.",
    description: `В июле 2042 руководство DCD объявило о завершении операции «Новый Рассвет». После почти тринадцати лет боёв американский континент официально признан свободным от крупных заражённых колоний.

Крупнейшая победа человечества с начала пандемии. Значительная часть мира оставалась опасной и практически необитаемой.`,
  });

  await ensureEvent("Слухи о специальных агентах DCD", {
    date: "2042+",
    accessLevel: 3,
    description: `После освобождения континента распространились слухи о секретных подразделениях внутри DCD, использующих носителей нулевой стадии как оперативников.

Очевидцы: способность чувствовать приближение заражённых, выдерживать смертельные ранения, необъяснимые способности. Руководство DCD отрицает. Засекреченность проектов усиливает подозрения.`,
  });

  await ensureEvent("Утечка файлов «Black Archive»", {
    date: "2047",
    accessLevel: 2,
    consequences: "Беспорядки. Теории об искусственном происхождении пандемии без официальных доказательств.",
    description: `Хакерская группировка «Black Archive» опубликовала тысячи документов, предположительно ЦРУ: программы биобезопасности до пандемии, проекты искусственного сокращения населения при кризисе ресурсов.

Подлинность большей части не подтверждена. Документы повреждены, страницы отсутствуют. Публикация вызвала беспорядки и недоверие к правительствам. Теории о неудачном эксперименте — без официальных доказательств.`,
  });

  await ensureEvent("Инцидент «Двенадцать»", {
    date: "2048-03-17",
    accessLevel: 4,
    documentIds: [docTwelve.id],
    consequences: "Появление класса «Судья». Причина взрывов неизвестна.",
    description: `Практически одновременно взорвались двенадцать исследовательских объектов DCD в Северной Америке. Связь со всеми лабораториями потеряна в течение суток.

Через несколько дней разведка сообщила о новом типе заражённых — «Судья»: выше Координаторов по интеллекту и силе, управление группами на расстоянии, возможные человеческие воспоминания.

Диверсия, саботаж или эксперимент — до сих пор неизвестно.`,
  });

  await ensureEvent("Нью-Йоркская резня", {
    date: "2049-10",
    accessLevel: 4,
    locationIds: [nyc.id],
    consequences: "Расследование засекречено. Слухи о Дригуре.",
    description: `За одну ночь в Нью-Йорке убиты более четырёх тысяч человек, в том числе сотрудники сил безопасности DCD. Камеры фиксировали отключения электричества, сбои связи, неизвестные вооружённые группы.

Расследование быстро засекретили. В подпольных сетях — слухи о древнем существе Дригур, якобы способном управлять заражёнными. Официально существование Дригура никогда не подтверждалось.`,
  });

  console.log("→ Записи звонков и диспетчерские…");
  const call1 = await ensureDialogue("Вызов 00:17 — деревня севернее Хайкоу", {
    kind: "call",
    accessLevel: 0,
    locationId: haikou.id,
    aboutLocationId: haikou.id,
    summary: "Первый сохранённый звонок ночи 26.08.2028. Ключ к следующему уровню допуска спрятан в репликах.",
    lines: [
      { speakerId: opChen.id, text: "Полиция Хайкоу, говорите." },
      {
        speakerId: callerLi.id,
        text: "Они у забора… тяжёлые шаги, постоянно. Не собаки. Слышите? Вой такой, будто из-под земли.",
      },
      { speakerId: opChen.id, text: "Адрес и сколько особей видите?" },
      {
        speakerId: callerLi.id,
        text: "Три… нет, четыре. Крупные, как волки, но волки сюда не заходят. Когти по стене скребут. Жена плачет, дети наверху.",
      },
      { speakerId: opChen.id, text: "Оставайтесь в доме. Патруль выезжает. Не открывайте дверь." },
      {
        speakerId: callerLi.id,
        text: "Они уже у окна— [шум удара, крик] —помогите— [обрыв связи]",
      },
      { speakerId: opChen.id, text: "Абонент потерян. Фиксирую вызов 00:17. Передаю HNK-07." },
    ],
  });

  const call2 = await ensureDialogue("Диспетчерская — потеря HNK-07 / HNK-12", {
    kind: "dispatch",
    accessLevel: 1,
    locationId: haikou.id,
    aboutLocationId: haikou.id,
    summary: "Канал патрулей. 26.08.2028, ~02:40–03:10.",
    lines: [
      { speakerId: opWei.id, text: "HNK-07, доложите обстановку." },
      {
        speakerId: patrol07.id,
        text: "Визуально — не волки. Размеры больше. Шерсти почти нет. Стреляли — не отступают. Запрашиваем подкрепление, срочно.",
      },
      { speakerId: opWei.id, text: "HNK-12, подойдите к сектору 07." },
      {
        speakerId: patrol12.id,
        text: "На месте. Видим тела… трое гражданских. Животные в стае, минимум восемь. Идут на нас.",
      },
      { speakerId: patrol07.id, text: "Они не чувствуют боли— [автоматическая очередь] —подкрепление!" },
      { speakerId: opWei.id, text: "HNK-07, повторите. HNK-07?" },
      { speakerId: patrol12.id, text: "07 молчит. Мы в окружении— [крики, обрыв]" },
      { speakerId: opWei.id, text: "Оба экипажа не на связи. Поднимаю ЧС по северному сектору." },
    ],
  });

  const call3 = await ensureDialogue("Вызов 01:04 — Санья, вторая ночь", {
    kind: "call",
    accessLevel: 0,
    locationId: sanya.id,
    aboutLocationId: sanya.id,
    summary: "27.08.2028. Одновременные обращения по всему югу острова.",
    lines: [
      { speakerId: opSanya.id, text: "Служба спасения Санья." },
      {
        speakerId: callerZhou.id,
        text: "Собаки соседей… все. И свиньи из двора. Они вместе, как стаи. Мой муж выстрелил — они не убегают!",
      },
      { speakerId: opSanya.id, text: "Закройтесь. Сколько точек атаки видите?" },
      {
        speakerId: callerZhou.id,
        text: "Весь квартал. Крики отовсюду. Обезьяны с холма тоже спустились, глаза красные, ненормальные.",
      },
      { speakerId: opSanya.id, text: "Держитесь. Направляем группу. Канал перегружен — не кладите трубку, если можете." },
      { speakerId: callerZhou.id, text: "Дверь… [вой, треск дерева] —они внутри— [тишина]" },
      {
        speakerId: opSanya.id,
        text: "Запись сохранена. За ночь таких вызовов — десятки. Фиксирую массовый инцидент.",
      },
    ],
  });

  const call4 = await ensureDialogue("Внутренний канал — больница №3", {
    kind: "log",
    accessLevel: 2,
    locationId: haikou.id,
    aboutLocationId: haikou.id,
    summary: "28.08.2028. Первые человеческие мутации в стационаре.",
    lines: [
      { speakerId: medic.id, text: "Палата 14: температура сорок один. Судороги. Кровотечение из глаз." },
      {
        speakerId: doctor.id,
        text: "Это не сепсис. Ткани меняются на глазах. Кости… слышите хруст? Эвакуируйте соседние палаты.",
      },
      { speakerId: medic.id, text: "Пациент встал. Он не должен стоять с такими переломами—" },
      { speakerId: doctor.id, text: "Блокируйте коридор! Никто без экипировки!" },
      {
        speakerId: medic.id,
        text: "Он напал на санитара. Ещё двое в 12-й… то же самое. Мы теряем этаж.",
      },
      {
        speakerId: doctor.id,
        text: "Передаю в военный штаб: стационар неконтролируем. Повторяю — неконтролируем.",
      },
    ],
  });

  console.log("→ Цепочка допусков…");
  await ensureUnlock("Фрагмент: ночной журнал Хайкоу", {
    grantsLevel: 1,
    dialogueId: call1.id,
    hint: "Слово из первого звонка — то, что слышал житель у забора.",
    solutionKey: "шаги",
    rewardCode: "HNK-NIGHT-01",
    cipherText: `ФАЙЛ HNK-DISP-260828
████████████████████
Доступ к каналу патрулей закрыт.
Для расшифровки введите слово, которое вызывающий назвал первым признаком угрозы у дома.

ШИФР: R4V3N-FMC-001
(архивный ярлык; ключ — из записи звонка)`,
  });

  await ensureUnlock("Фрагмент: сводка северного сектора", {
    grantsLevel: 2,
    dialogueId: call2.id,
    hint: "Слово из запроса патруля HNK-07 по радио.",
    solutionKey: "подкрепление",
    rewardCode: "HNK-SECTOR-02",
    cipherText: `СЕКТОР СЕВЕР / ОГРАНИЧЕННЫЙ
Отчёты HNK-07 и HNK-12 разблокируются при L2.
Ключ — то, что экипаж запросил после первого контакта.`,
  });

  await ensureUnlock("Фрагмент: медпротокол", {
    grantsLevel: 2,
    documentId: docHospital.id,
    hint: "Служебная пометка в конце медпротокола.",
    solutionKey: "карантинный",
    rewardCode: "MED-HAIKOU-03",
    cipherText: `МЕДДОКУМЕНТ ЗАШИФРОВАН
Полный протокол больницы №3 доступен после ввода служебной пометки из текста отчёта.`,
  });

  await ensureUnlock("Фрагмент: досье Координаторы", {
    grantsLevel: 3,
    documentId: docCoordinators.id,
    hint: "Повреждённый фрагмент в конце досье — одно слово.",
    solutionKey: "судия",
    rewardCode: "DCD-COORD-36",
    cipherText: `DCD CLASSIFIED L3
Материалы по Координаторам и носителям нулевой стадии.
Ключ извлечён из повреждённой строки досье.`,
  });

  await ensureUnlock("Фрагмент: «Двенадцать» / Дригур", {
    grantsLevel: 4,
    documentId: docTwelve.id,
    hint: "Имя из слухов после Нью-Йорка — в повреждённом отчёте.",
    solutionKey: "дригур",
    rewardCode: "BLK-TWELVE-48",
    cipherText: `ОСОБОЙ ВАЖНОСТИ
Инцидент «Двенадцать» и материалы по Нью-Йоркской резне.
Ключ — имя, которое не подтверждалось официально.`,
  });

  // tie DCD org vaguely via faction on a dialogue
  await prisma.dialogue.updateMany({
    where: { title: "Внутренний канал — больница №3", factionId: null },
    data: { factionId: infectedFaction.id },
  });
  void dcdFaction;
  void dcdOrg;

  console.log("✓ Хронология вспышки загружена.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
