export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Pokémon Manager</p>
        <p className="footer-subtext">Verzamel je favoriete Pokémon en stel je teams samen.</p>
      </div>
    </footer>
  );
}
