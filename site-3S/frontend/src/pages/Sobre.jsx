export default function Sobre() {
  const sobreImg = "https://images.unsplash.com/photo‑…"; // por exemplo, uma das imagens acima
  return (
    <section className="about">
      <img src={sobreImg} alt="Ambiente industrial" />
      <div className="about-text">
        <h2>Quem Somos</h2>
        <p>…</p>
      </div>
    </section>
  );
}
