# Firestore schema

## collections

### users/{userId}
```ts
{
  email: string;
  displayName?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### wordLists/{listId}
```ts
{
  userId: string;
  title: string;
  rawText: string;
  cardCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### cards/{cardId}
```ts
{
  userId: string;
  listId: string;
  german: string;
  ukrainian: string;
  type: "noun" | "verb" | "phrase" | "expression" | "grammar";
  article?: "der" | "die" | "das";
  lemma?: string;
  preterite?: string;
  participle?: string;
  grammar?: string;
  exampleDe?: string;
  exampleUa?: string;
  correctedGerman?: string;
  correctionNote?: string;
  commonMistakes?: string[];
  topic?: string;
  level?: string;
  status: "new" | "learning" | "review" | "mastered";
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: string;
  createdAt: string;
  updatedAt: string;
}
```

### reviews/{reviewId}
```ts
{
  userId: string;
  cardId: string;
  exerciseType: "de_to_ua" | "ua_to_de" | "cloze" | "production";
  prompt: string;
  answer: string;
  isCorrect: boolean;
  feedback?: string;
  errorType?: string;
  createdAt: string;
}
```
