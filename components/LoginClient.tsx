"use client";

import { useState } from "react";
import { getClientAuth, hasFirebaseConfig } from "@/lib/firebase";

export function LoginClient() {
  const firebaseConfigured = hasFirebaseConfig();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    firebaseConfigured
      ? "Firebase Auth готовий. Увійдіть або створіть акаунт."
      : "MVP працює без логіну через localStorage. Для production додайте Firebase environment variables у Vercel."
  );

  async function signIn(mode: "login" | "signup") {
    try {
      const auth = await getClientAuth();
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import("firebase/auth");

      const credential =
        mode === "signup"
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);

      setMessage(`Вхід виконано: ${credential.user.email ?? "користувач"}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Помилка входу");
    }
  }

  return (
    <section className="card stack" style={{ maxWidth: 520 }}>
      <h1>Login</h1>
      <p className="muted">
        Для локального demo логін не потрібен. Для production увімкніть Email/Password у Firebase Console і додайте Firebase config у Vercel.
      </p>
      {!firebaseConfigured ? (
        <p className="answer">
          Firebase не налаштований. Це нормально для MVP: імпорт, тренування і повторення працюють у demo-режимі через localStorage.
        </p>
      ) : null}
      <div className="form-row">
        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="form-row">
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      <div className="row">
        <button className="button" onClick={() => signIn("login")} disabled={!firebaseConfigured}>
          Увійти
        </button>
        <button className="button secondary" onClick={() => signIn("signup")} disabled={!firebaseConfigured}>
          Створити акаунт
        </button>
      </div>
      <p className="answer">{message}</p>
    </section>
  );
}
