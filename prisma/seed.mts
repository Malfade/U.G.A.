import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const council = await prisma.faction.create({
    data: {
      name: "Совет",
      description: "Глобальный руководящий орган, созданный для контроля и сдерживания аномалий. Действует в условиях строгой секретности. Официально не существует.",
      foundedDate: "2050",
      colorScheme: JSON.stringify({ primary: "blue", secondary: "slate" }),
      terminology: JSON.stringify({ operative: "агент", threat: "объект угрозы", base: "комплекс" }),
    },
  });

  const redHand = await prisma.faction.create({
    data: {
      name: "Красная Рука",
      description: "Военизированная организация сопротивления. Считают Совет тираническим режимом, скрывающим правду от человечества.",
      foundedDate: "2061",
      colorScheme: JSON.stringify({ primary: "red", secondary: "neutral" }),
      terminology: JSON.stringify({ operative: "боец", threat: "цель", base: "убежище" }),
    },
  });

  const rebels = await prisma.faction.create({
    data: {
      name: "Повстанцы",
      description: "Разрозненные группы гражданского сопротивления. Не имеют единого командования.",
      foundedDate: "2068",
      colorScheme: JSON.stringify({ primary: "amber", secondary: "stone" }),
    },
  });

  const civilians = await prisma.faction.create({
    data: {
      name: "Мирные жители",
      description: "Обычные граждане, живущие в тени аномалий.",
      colorScheme: JSON.stringify({ primary: "teal", secondary: "zinc" }),
    },
  });

  const infected = await prisma.faction.create({
    data: {
      name: "Заражённые",
      description: "Люди и существа, подвергшиеся воздействию HP-109. Их восприятие реальности искажено.",
      colorScheme: JSON.stringify({ primary: "purple", secondary: "gray" }),
    },
  });

  const mel = await prisma.character.create({
    data: {
      name: "Мэл", callsign: "Raven", gender: "Женский", status: "Активна",
      description: "Одна из ключевых фигур в истории HP-109. Носитель паразита, который по неизвестным причинам не принимает её полностью.",
      biography: "Детали биографии засекречены. Известно, что была связана как с Советом, так и с Красной Рукой. После инцидента «Горизонт» считается пропавшей.",
      quotes: JSON.stringify(["Я была там.", "Вы не понимаете, что вы создали."]),
      abilities: "Частичная устойчивость к HP-109. Повышенная регенерация.",
      accessLevel: 2,
    },
  });

  const evans = await prisma.character.create({
    data: {
      name: "Директор Эванс", gender: "Мужской", status: "Активен", rank: "Директор",
      description: "Один из руководителей Совета. Курирует проекты, связанные с HP-109.",
      biography: "Возглавил научное подразделение Совета в 2058 году. Инициатор проекта «Десятая».",
      factionId: council.id, accessLevel: 3,
    },
  });

  const advisorLi = await prisma.character.create({
    data: {
      name: "Советник Ли", gender: "Мужской", status: "Активен", rank: "Советник",
      description: "Член высшего совета. Известен параноидальным отношением к потенциальным угрозам.",
      quotes: JSON.stringify(["Она знает больше, чем говорит.", "Доверие — это роскошь, которую мы не можем себе позволить."]),
      factionId: council.id, accessLevel: 3,
    },
  });

  const commanderVolk = await prisma.character.create({
    data: {
      name: "Командир Волк", callsign: "Волк", gender: "Мужской", status: "Активен", rank: "Командир",
      description: "Полевой командир Красной Руки. Ветеран множества операций.",
      factionId: redHand.id, accessLevel: 1,
    },
  });

  const novosibirsk = await prisma.location.create({ data: { name: "Новосибирск", type: "city", coordX: 55.0, coordY: 82.9, population: "1.2 млн", description: "Крупный город. Место нескольких инцидентов, связанных с HP-109." } });
  const horizonComplex = await prisma.location.create({ data: { name: "Комплекс «Горизонт»", type: "base", coordX: 56.3, coordY: 84.1, description: "Секретный исследовательский комплекс Совета.", accessLevel: 3 } });
  const zone7 = await prisma.location.create({ data: { name: "Зона-7", type: "anomalyZone", coordX: 54.2, coordY: 80.5, description: "Зона повышенной аномальной активности. Доступ запрещён.", accessLevel: 4 } });
  const moscow = await prisma.location.create({ data: { name: "Москва", type: "city", coordX: 55.75, coordY: 37.6, population: "12.6 млн", description: "Столица. Штаб-квартира Совета расположена в закрытом районе." } });

  const discoveryHP109 = await prisma.event.create({ data: { name: "Обнаружение HP-109", date: "2025", description: "Первое зарегистрированное обнаружение паразитарной аномалии HP-109.", cause: "Геологическая экспедиция в районе будущей Зоны-7.", consequences: "Начало секретной программы исследований. Формирование протоколов сдерживания." } });
  await prisma.event.create({ data: { name: "Первые эксперименты", date: "2034", description: "Начало контролируемых экспериментов с HP-109 на биологических образцах.", consequences: "Подтверждена способность паразита к симбиозу. Первые случаи заражения.", accessLevel: 2 } });
  const councilFormed = await prisma.event.create({ data: { name: "Формирование Совета", date: "2050", description: "Создание глобального руководящего органа для координации усилий по сдерживанию аномалий." } });
  const horizonIncident = await prisma.event.create({ data: { name: "Инцидент «Горизонт»", date: "2076", description: "Катастрофический инцидент в исследовательском комплексе «Горизонт». Детали засекречены.", consequences: "Массовая эвакуация. Формирование новых зон заражения. Изменение стратегии Совета.", accessLevel: 3 } });

  await prisma.eventLocation.createMany({ data: [
    { eventId: discoveryHP109.id, locationId: zone7.id },
    { eventId: horizonIncident.id, locationId: horizonComplex.id },
    { eventId: councilFormed.id, locationId: moscow.id },
  ]});

  await prisma.characterEvent.createMany({ data: [
    { characterId: mel.id, eventId: horizonIncident.id },
    { characterId: evans.id, eventId: horizonIncident.id },
    { characterId: evans.id, eventId: councilFormed.id },
    { characterId: mel.id, eventId: discoveryHP109.id },
  ]});

  const report77B = await prisma.document.create({ data: { title: "Отчёт 77-B", type: "report", content: "ОТЧЁТ О НАБЛЮДЕНИИ\nСубъект: МЭЛ (позывной: Raven)\nДата: 14.03.2074\n\nСубъект была обнаружена в секторе 4-Б комплекса «Горизонт» за 48 часов до инцидента. Анализ камер наблюдения показывает, что она имела доступ к лаборатории уровня 3, несмотря на отсутствие допуска.\n\nВ ходе допроса субъект заявила: «Вы не понимаете, что вы создали.»\n\nКлюч доступа: ALPHA-7\n\nРекомендация: усилить наблюдение. Рассмотреть возможность задержания.", accessLevel: 2 } });

  const interrogation = await prisma.document.create({ data: { title: "Запись допроса #4401", type: "transcript", content: "ЗАПИСЬ ДОПРОСА\nДопрашивающий: Советник Ли\nСубъект: Мэл\nДата: 16.03.2074\n\n[00:00:14]\nЛи: Расскажите, что вы делали в лаборатории.\nМэл: Искала ответы.\nЛи: Какие ответы?\nМэл: Те, которые вы прячете.\n[00:01:02]\nЛи: Вы понимаете, что нарушили протокол безопасности?\nМэл: Протокол — это не безопасность. Это контроль.\n[00:01:30]\nЛи: Кто дал вам доступ?\nМэл: ████████████\n[00:02:15]\n[ЗАПИСЬ ПРЕРВАНА]", accessLevel: 3 } });

  const projectTenth = await prisma.document.create({ data: { title: "Проект «Десятая» — Обзор", type: "report", content: "КЛАССИФИКАЦИЯ: СОВЕРШЕННО СЕКРЕТНО\n\nПроект «Десятая» инициирован Директором Эвансом в 2069 году.\nЦель: исследование возможности управляемого симбиоза с HP-109.\n\nТекущий статус: ████████████\nЧисло испытуемых: ████████████\nРезультаты: ████████████\n\nПримечание куратора:\n«Мэл — единственный известный случай стабильного отторжения. Если мы поймём почему, мы поймём всё.»", accessLevel: 4, damagePercent: 15 } });

  const camera17 = await prisma.document.create({ data: { title: "Запись камеры 17", type: "video", content: "[ВИДЕОЗАПИСЬ]\nЛокация: Комплекс «Горизонт», сектор 7-А\nДата: 17.05.2076\nВремя: 23:46 (за 14 минут до инцидента)\n\n[23:46] Фигура пересекает коридор. Идентификация: МЭЛ\n[23:47] Субъект останавливается у двери лаборатории\n[23:48] Субъект вводит код доступа\n[23:49] Дверь открывается. Внутри видно свечение.\n[23:50] ████████████\n[23:51] [ПОМЕХИ]\n[23:52] [СИГНАЛ ПОТЕРЯН]", accessLevel: 3 } });

  const redHandBroadcast = await prisma.document.create({ data: { title: "Радиоперехват Красной Руки", type: "audio", content: "[ПЕРЕХВАТ РАДИОЧАСТОТЫ]\nЧастота: 142.7 МГц\nДата: 19.05.2076\n\n— Волк, это Ворон. Приём.\n— Ворон, Волк на связи.\n— Горизонт пал. Повторяю: Горизонт пал.\n— Потери?\n— Неизвестно. Периметр оцеплен Советом. Но наши источники говорят — это не авария.\n— Что значит «не авария»?\n— Кто-то это сделал намеренно.\n— Кто?\n— ████████████\n— Понял. Начинаем операцию «Рассвет».", accessLevel: 2 } });

  await prisma.characterDocument.createMany({ data: [
    { characterId: mel.id, documentId: report77B.id },
    { characterId: mel.id, documentId: interrogation.id },
    { characterId: mel.id, documentId: camera17.id },
    { characterId: mel.id, documentId: projectTenth.id },
    { characterId: evans.id, documentId: projectTenth.id },
    { characterId: advisorLi.id, documentId: interrogation.id },
    { characterId: commanderVolk.id, documentId: redHandBroadcast.id },
  ]});

  await prisma.eventDocument.createMany({ data: [
    { eventId: horizonIncident.id, documentId: camera17.id },
    { eventId: horizonIncident.id, documentId: redHandBroadcast.id },
    { eventId: horizonIncident.id, documentId: report77B.id },
  ]});

  const melEvans = await prisma.relationship.create({ data: { characterAId: evans.id, characterBId: mel.id, type: "Наставник", trustLevel: 83, startDate: "2059", description: "Сложные отношения наставника и подопечной, перешедшие в конфликт." } });
  await prisma.relationshipHistory.createMany({ data: [
    { relationshipId: melEvans.id, year: "2059", status: "Незнакомы" },
    { relationshipId: melEvans.id, year: "2068", status: "Наставник", description: "Эванс начал курировать Мэл в рамках проекта." },
    { relationshipId: melEvans.id, year: "2072", status: "Конфликт", description: "Разногласия по поводу методов исследования HP-109." },
    { relationshipId: melEvans.id, year: "2076", status: "Скрывает информацию", description: "После инцидента «Горизонт» характер связи неясен." },
  ]});

  await prisma.relationship.create({ data: { characterAId: advisorLi.id, characterBId: mel.id, type: "Подозрение", trustLevel: 15, startDate: "2070", description: "Советник Ли считает Мэл потенциальной угрозой безопасности." } });
  await prisma.relationship.create({ data: { characterAId: mel.id, characterBId: commanderVolk.id, type: "Союзник", trustLevel: 65, startDate: "2071", description: "Мэл работала с Красной Рукой в качестве оперативника." } });

  await prisma.factionView.createMany({ data: [
    { entityType: "character", entityId: mel.id, characterId: mel.id, factionId: council.id, content: JSON.stringify({ status: "Потенциальная угроза", description: "Нестабильна. Рекомендация: в случае обнаружения задержать.", assessment: "Психологическая оценка: нестабильна.", lastKnownLocation: "████████████" }) },
    { entityType: "character", entityId: mel.id, characterId: mel.id, factionId: redHand.id, content: JSON.stringify({ status: "Пропала", description: "Одна из лучших оперативников. После «Горизонта» считается пропавшей. Большинство бойцов уверены, что она жива.", callsign: "Raven", reputation: "Легенда среди бойцов." }) },
    { entityType: "character", entityId: mel.id, characterId: mel.id, factionId: infected.id, content: JSON.stringify({ status: "Аномалия", description: "Мэл... Она пахнет смертью. Но паразит не принимает её. Почему?", perception: "Страх и любопытство." }) },
    { entityType: "character", entityId: mel.id, characterId: mel.id, factionId: civilians.id, content: JSON.stringify({ status: "Неизвестна", description: "Имя встречается в слухах о событиях в закрытых зонах. Достоверной информации нет." }) },
  ]});

  await prisma.factionView.createMany({ data: [
    { entityType: "event", entityId: horizonIncident.id, eventId: horizonIncident.id, factionId: council.id, content: JSON.stringify({ description: "Техногенная авария в исследовательском комплексе. Причина: нарушение протокола безопасности.", casualties: "████████████", verdict: "Расследование продолжается." }) },
    { entityType: "event", entityId: horizonIncident.id, eventId: horizonIncident.id, factionId: redHand.id, content: JSON.stringify({ description: "Диверсия изнутри. Кто-то сделал это намеренно. Совет пытается скрыть правду.", casualties: "Сотни жертв. Совет занижает цифры.", verdict: "Совет виновен. Эксперименты вышли из-под контроля." }) },
    { entityType: "event", entityId: horizonIncident.id, eventId: horizonIncident.id, factionId: civilians.id, content: JSON.stringify({ description: "Произошёл взрыв на промышленном объекте. Власти эвакуировали прилегающие районы.", casualties: "По официальным данным — 12 человек." }) },
  ]});

  await prisma.organization.create({ data: { name: "Научный департамент Совета", description: "Подразделение Совета, ответственное за исследование аномалий и разработку методов сдерживания.", foundedDate: "2050", hierarchy: "Директор Эванс → Главный исследователь → Группы по направлениям", goals: "Понимание природы HP-109. Разработка вакцины. Контролируемое использование аномалий." } });
  await prisma.organization.create({ data: { name: "Отдел внутренней безопасности", description: "Контрразведка Совета. Отвечает за выявление утечек, предателей и внешних угроз.", foundedDate: "2052", goals: "Безопасность Совета. Нейтрализация Красной Руки." } });

  await prisma.aRGKey.create({ data: { code: "ALPHA-7", hiddenInDocumentId: report77B.id } });
  await prisma.aRGLock.create({ data: { documentId: projectTenth.id, keyRequired: "ALPHA-7", hint: "Ключ спрятан в одном из отчётов наблюдения." } });

  await prisma.objectiveTruth.create({ data: { entityType: "event", entityId: horizonIncident.id, content: "Инцидент «Горизонт» был вызван намеренной активацией HP-109 Директором Эвансом в попытке спровоцировать управляемый симбиоз. Мэл пыталась остановить процесс, но прибыла слишком поздно. Совет скрывает причастность Эванса. Красная Рука не знает деталей, но правильно подозревает саботаж изнутри." } });
  await prisma.objectiveTruth.create({ data: { entityType: "character", entityId: mel.id, content: "Мэл — результат первого успешного контакта с HP-109, произошедшего в детстве. Паразит интегрировался частично, что дало ей уникальную устойчивость. Она не отторгает паразита — они существуют в равновесии." } });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
