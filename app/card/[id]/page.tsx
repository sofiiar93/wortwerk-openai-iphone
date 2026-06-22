type CardDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { id } = await params;

  return (
    <section className="card">
      <h1>Card Detail</h1>
      <p className="muted">Card ID: {id}</p>
      <p>Наступна задача: реалізувати читання конкретної картки з Firestore/localStorage і редагування полів.</p>
    </section>
  );
}
