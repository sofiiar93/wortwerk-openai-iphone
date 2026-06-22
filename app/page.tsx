import Link from "next/link";
import { PwaInstallGuide } from "@/components/PwaInstallGuide";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>Сирий список слів → реальне володіння німецькою.</h1>
        <p>
          iPhone-first MVP для студентів A2–B2: імпорт списку від викладача,
          OpenAI-нормалізація фраз, граматичні мітки, картки, інтервальне повторення й аналіз помилок.
        </p>
        <div className="row">
          <Link className="button" href="/import">Імпортувати список</Link>
          <Link className="button secondary" href="/review">Почати повторення</Link>
        </div>
      </section>
      <PwaInstallGuide />
      <section className="grid">
        <div className="card"><h3>1. Import</h3><p className="muted">Вставляєте хаотичний перелік слів після уроку.</p></div>
        <div className="card"><h3>2. Normalize</h3><p className="muted">OpenAI API виправляє помилки, додає приклади й граматику.</p></div>
        <div className="card"><h3>3. Produce</h3><p className="muted">Користувач пише речення, а не просто клікає переклад.</p></div>
      </section>
    </main>
  );
}
