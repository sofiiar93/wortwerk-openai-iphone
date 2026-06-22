import { NormalizedCard, VocabCard } from "@/types/vocab";

const ARTICLES = ["der", "die", "das"] as const;
type GermanArticle = (typeof ARTICLES)[number];

type ExamplePair = {
  exampleDe: string;
  exampleUa: string;
};

const EXAMPLE_BY_GERMAN: Record<string, ExamplePair> = {
  "es ist unerträglich heiß": {
    exampleDe: "Heute ist es unerträglich heiß.",
    exampleUa: "Сьогодні нестерпно жарко."
  },
  "das ist unerträglich heiß": {
    exampleDe: "Heute ist es unerträglich heiß.",
    exampleUa: "Сьогодні нестерпно жарко."
  },
  "von zu hause arbeiten": {
    exampleDe: "Ich arbeite zweimal pro Woche von zu Hause.",
    exampleUa: "Я працюю з дому двічі на тиждень."
  },
  "vorherig": {
    exampleDe: "In der vorherigen Stunde haben wir neue Wörter gelernt.",
    exampleUa: "На попередньому занятті ми вивчили нові слова."
  },
  "das hat mich beeinflusst": {
    exampleDe: "Diese Erfahrung hat mich stark beeinflusst.",
    exampleUa: "Цей досвід сильно вплинув на мене."
  },
  "der frühaufsteher": {
    exampleDe: "Mein Vater ist ein Frühaufsteher und steht um sechs Uhr auf.",
    exampleUa: "Мій батько рано встає і прокидається о шостій."
  },
  "die nachteule": {
    exampleDe: "Am Wochenende bin ich oft eine Nachteule.",
    exampleUa: "На вихідних я часто нічна сова."
  },
  "die weiterbildung / die fortbildung": {
    exampleDe: "Ich möchte eine Weiterbildung im Bereich IT machen.",
    exampleUa: "Я хочу пройти підвищення кваліфікації у сфері IT."
  },
  "sparen": {
    exampleDe: "Ich spare jeden Monat etwas Geld.",
    exampleUa: "Я щомісяця відкладаю трохи грошей."
  },
  "erhalten": {
    exampleDe: "Wir müssen die alte Architektur erhalten.",
    exampleUa: "Ми повинні зберегти стару архітектуру."
  },
  "die erholung": {
    exampleDe: "Nach der Arbeit brauche ich Erholung.",
    exampleUa: "Після роботи мені потрібен відпочинок."
  },
  "schon wieder": {
    exampleDe: "Schon wieder habe ich den Bus verpasst.",
    exampleUa: "Я вже знову пропустив автобус."
  },
  "viel auf einmal kaufen": {
    exampleDe: "Ich kaufe nicht gern viel auf einmal.",
    exampleUa: "Я не люблю купувати багато за один раз."
  },
  "vermeiden": {
    exampleDe: "Ich versuche, unnötige Ausgaben zu vermeiden.",
    exampleUa: "Я намагаюся уникати зайвих витрат."
  },
  "wenn wir schon beim thema sind": {
    exampleDe: "Wenn wir schon beim Thema sind, sollten wir auch über Konsum sprechen.",
    exampleUa: "Якщо ми вже про цю тему, нам також варто поговорити про споживання."
  },
  "wenn wir schon bei thema sind": {
    exampleDe: "Wenn wir schon beim Thema sind, sollten wir auch über Konsum sprechen.",
    exampleUa: "Якщо ми вже про цю тему, нам також варто поговорити про споживання."
  },
  "benzin verbrauchen": {
    exampleDe: "Mein Auto verbraucht viel Benzin.",
    exampleUa: "Моя машина споживає багато бензину."
  },
  "sich viele gedanken machen über + akk": {
    exampleDe: "Ich mache mir viele Gedanken über meine Zukunft.",
    exampleUa: "Я багато думаю про своє майбутнє."
  },
  "schuld sein an + dat": {
    exampleDe: "Er ist schuld an dem Problem.",
    exampleUa: "Він винен у цій проблемі."
  },
  "der konsum": {
    exampleDe: "Der Konsum von Plastik sollte reduziert werden.",
    exampleUa: "Споживання пластику треба зменшити."
  },
  "konsumieren": {
    exampleDe: "Viele Menschen konsumieren mehr, als sie brauchen.",
    exampleUa: "Багато людей споживають більше, ніж їм потрібно."
  },
  "grenzen an ungarn": {
    exampleDe: "Österreich grenzt an Ungarn.",
    exampleUa: "Австрія межує з Угорщиною."
  },
  "an ungarn grenzen": {
    exampleDe: "Österreich grenzt an Ungarn.",
    exampleUa: "Австрія межує з Угорщиною."
  },
  "den standpunkt vertreten": {
    exampleDe: "Ich vertrete den Standpunkt, dass man bewusster einkaufen sollte.",
    exampleUa: "Я дотримуюся точки зору, що треба купувати свідоміше."
  },
  "das familienmitglied": {
    exampleDe: "Mein Bruder ist ein wichtiges Familienmitglied.",
    exampleUa: "Мій брат — важливий член сім’ї."
  },
  "übertreiben": {
    exampleDe: "Du übertreibst ein bisschen.",
    exampleUa: "Ти трохи перебільшуєш."
  },
  "im großen und ganzen": {
    exampleDe: "Im Großen und Ganzen bin ich mit dem Kurs zufrieden.",
    exampleUa: "Загалом я задоволений курсом."
  },
  "nicht unnötiges": {
    exampleDe: "Ich kaufe nichts Unnötiges.",
    exampleUa: "Я не купую нічого зайвого."
  },
  "nichts unnötiges": {
    exampleDe: "Ich kaufe nichts Unnötiges.",
    exampleUa: "Я не купую нічого зайвого."
  },
  "schnell verderbende produkte": {
    exampleDe: "Schnell verderbende Produkte sollte man nicht lange lagern.",
    exampleUa: "Продукти, які швидко псуються, не варто довго зберігати."
  }
};

function isGermanArticle(value: string): value is GermanArticle {
  return (ARTICLES as readonly string[]).includes(value);
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeExampleKey(value: string): string {
  return value
    .trim()
    .replace(/[.…]+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function createFallbackExample(german: string, ukrainian: string, type: NormalizedCard["type"]): ExamplePair {
  if (type === "noun") {
    return {
      exampleDe: `Ich benutze das Wort „${german}“ in einem eigenen Satz.`,
      exampleUa: `Я використовую слово «${ukrainian}» у власному реченні.`
    };
  }

  if (type === "verb") {
    return {
      exampleDe: `Ich kann „${german}“ in einer Alltagssituation benutzen.`,
      exampleUa: `Я можу використати «${ukrainian}» у повсякденній ситуації.`
    };
  }

  return {
    exampleDe: `Der Ausdruck „${german}“ ist im Alltag nützlich.`,
    exampleUa: `Вираз «${ukrainian}» корисний у повсякденному мовленні.`
  };
}

function getExample(german: string, ukrainian: string, type: NormalizedCard["type"], correctedGerman?: string): ExamplePair {
  const candidates = [correctedGerman, german].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    const example = EXAMPLE_BY_GERMAN[normalizeExampleKey(candidate)];
    if (example) return example;
  }

  return createFallbackExample(correctedGerman || german, ukrainian, type);
}

function detectType(german: string): NormalizedCard["type"] {
  const lower = german.toLowerCase();
  if (ARTICLES.some((article) => lower.startsWith(`${article} `))) return "noun";
  if (lower.includes(" + akk") || lower.includes(" + dat") || lower.includes(" + gen")) return "grammar";
  if (lower.includes(" ")) return "phrase";
  return "verb";
}

function extractArticle(german: string): VocabCard["article"] | undefined {
  const firstWord = german.trim().split(/\s+/)[0];
  if (!firstWord) return undefined;

  const article = firstWord.toLowerCase();
  return isGermanArticle(article) ? article : undefined;
}

function normalizeKnownIssues(german: string): { correctedGerman?: string; correctionNote?: string } {
  const cleaned = german.trim();
  if (/wenn wir schon bei thema sind/i.test(cleaned)) {
    return {
      correctedGerman: cleaned.replace(/bei Thema/i, "beim Thema"),
      correctionNote: "У сталій фразі природно: „Wenn wir schon beim Thema sind …“. „beim“ = „bei dem“."
    };
  }
  if (/^das ist unerträglich heiß$/i.test(cleaned)) {
    return {
      correctedGerman: "Es ist unerträglich heiß.",
      correctionNote: "Якщо йдеться про погоду або температуру, стандартно: „Es ist …“."
    };
  }
  if (/^nicht unnötiges$/i.test(cleaned)) {
    return {
      correctedGerman: "nichts Unnötiges",
      correctionNote: "Тут потрібна форма „nichts Unnötiges“ — «нічого зайвого»."
    };
  }
  if (/^grenzen an ungarn$/i.test(cleaned)) {
    return {
      correctedGerman: "an Ungarn grenzen",
      correctionNote: "Інфінітивну конструкцію краще зберігати як „an Ungarn grenzen“."
    };
  }
  return {};
}

function parseLine(line: string): NormalizedCard | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const parts = trimmed.split(/\s+-\s+/).map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  const ukrainian = parts.at(-1);
  const germanParts = parts.slice(0, -1);
  const firstGermanPart = germanParts[0];

  if (!ukrainian || !firstGermanPart) return null;

  const german = firstGermanPart;
  const correction = normalizeKnownIssues(german);
  const initialType = detectType(german);
  const example = getExample(german, ukrainian, initialType, correction.correctedGerman);

  const card: NormalizedCard = {
    raw: trimmed,
    german,
    ukrainian,
    type: initialType,
    exampleDe: example.exampleDe,
    exampleUa: example.exampleUa,
    status: "new",
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReviewAt: nowIso(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
    ...correction
  };

  const article = extractArticle(german);
  if (article) card.article = article;

  if (germanParts.length >= 3) {
    const [lemma, preterite, participle] = germanParts;

    if (lemma && preterite && participle) {
      card.type = "verb";
      card.lemma = lemma;
      card.preterite = preterite;
      card.participle = participle;
      card.german = lemma;
      card.grammar = `Präteritum: ${preterite}; Partizip II: ${participle}`;
      const verbExample = getExample(lemma, ukrainian, "verb", card.correctedGerman);
      card.exampleDe = verbExample.exampleDe;
      card.exampleUa = verbExample.exampleUa;
    }
  }

  const regularVerbMarker = germanParts[1];
  if (germanParts.length === 2 && regularVerbMarker && /^te[-–—]?t$/i.test(regularVerbMarker.replace(/\s/g, ""))) {
    card.type = "verb";
    card.lemma = firstGermanPart;
    card.grammar = "Regular verb pattern: -te / -t. Перевірити повні форми перед збереженням.";
    const verbExample = getExample(firstGermanPart, ukrainian, "verb", card.correctedGerman);
    card.exampleDe = verbExample.exampleDe;
    card.exampleUa = verbExample.exampleUa;
  }

  if (german.includes("/")) {
    card.type = "phrase";
    card.correctionNote = [card.correctionNote, "Запис містить альтернативи через /. У production-версії краще розбити на окремі картки."].filter(Boolean).join(" ");
  }

  if (german.includes("+ Akk")) card.grammar = [card.grammar, "+ Akkusativ"].filter(Boolean).join("; ");
  if (german.includes("+ Dat")) card.grammar = [card.grammar, "+ Dativ"].filter(Boolean).join("; ");

  return card;
}

export function parseVocabularyList(rawText: string): NormalizedCard[] {
  return rawText
    .split(/\r?\n/)
    .map(parseLine)
    .filter((card): card is NormalizedCard => Boolean(card));
}

const CSV_COLUMNS = [
  "german",
  "ukrainian",
  "exampleDe",
  "exampleUa",
  "type",
  "grammar",
  "correctedGerman",
  "correctionNote"
] as const satisfies readonly (keyof NormalizedCard)[];

export function cardsToCsv(cards: NormalizedCard[]) {
  const header = [...CSV_COLUMNS];
  const rows = cards.map((card) =>
    CSV_COLUMNS.map((key) => JSON.stringify(card[key] ?? "")).join(",")
  );

  return [header.join(","), ...rows].join("\n");
}
