export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} PokéCorp Inc. - Geen van onze Pokémon valt onder de ARBO-wetgeving, we doen niet aan slavernij.</p>
        <p className="footer-subtext">Zakelijke oplossingen voor efficiënt Pokémon-teammanagement.</p>
      </div>
    </footer>
  );
}
