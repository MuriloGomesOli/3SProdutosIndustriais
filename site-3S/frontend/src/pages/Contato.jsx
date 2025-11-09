export default function Contato() {
  return (
    <section className="contato">
      <h2>Contato</h2>
      <form className="form-contato" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Nome" required />
        <input type="email" placeholder="E-mail" required />
        <textarea placeholder="Mensagem" required></textarea>
        <button type="submit" className="btn">Enviar</button>
      </form>
    </section>
  );
}
