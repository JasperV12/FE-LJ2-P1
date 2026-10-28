export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Pokémon Manager</p>
        <p className="footer-subtext">Stel uw favoriete Pokémon samen om u te helpen met werk, we doen sowieso niet aan slavernij van de Pokémon.</p>
      </div>
    </footer>
  );
}
