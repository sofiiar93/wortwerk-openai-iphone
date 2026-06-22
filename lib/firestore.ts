import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase";
import type { NormalizedCard, ReviewLog, VocabCard, WordList } from "@/types/vocab";

export async function createWordList(userId: string, title: string, rawText: string, cards: NormalizedCard[]) {
  const db = await getClientDb();
  const listRef = await addDoc(collection(db, "wordLists"), {
    userId,
    title,
    rawText,
    cardCount: cards.length,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  } satisfies Omit<WordList, "id" | "createdAt" | "updatedAt"> & { createdAt: unknown; updatedAt: unknown });

  await Promise.all(
    cards.map((card) =>
      addDoc(collection(db, "cards"), {
        ...card,
        userId,
        listId: listRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    )
  );

  return listRef.id;
}

export async function getDueCards(userId: string, maxResults = 20): Promise<VocabCard[]> {
  const db = await getClientDb();
  const q = query(
    collection(db, "cards"),
    where("userId", "==", userId),
    where("nextReviewAt", "<=", new Date().toISOString()),
    orderBy("nextReviewAt", "asc"),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VocabCard));
}

export async function getRecentCards(userId: string, maxResults = 40): Promise<VocabCard[]> {
  const db = await getClientDb();
  const q = query(collection(db, "cards"), where("userId", "==", userId), orderBy("updatedAt", "desc"), limit(maxResults));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as VocabCard));
}

export async function updateCard(card: VocabCard) {
  const db = await getClientDb();
  if (!card.id) throw new Error("Cannot update card without id");
  const { id, ...payload } = card;
  await updateDoc(doc(db, "cards", id), payload);
}

export async function createReviewLog(log: ReviewLog) {
  const db = await getClientDb();
  await addDoc(collection(db, "reviews"), log);
}
