import { TablesGrid } from "./features/tables/components/TablesGrid/TablesGrid";
import "./styles/App.css";

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Restaurant POS</h1>
        <p>Gestión de restaurante</p>
      </header>

      <nav className="app__nav" aria-label="Navegación principal">
        <button className="nav-link nav-link--active" type="button">
          Mesas
        </button>
        <button className="nav-link" type="button" disabled>
          Historial de Pedidos (Próximamente)
        </button>
        <button className="nav-link" type="button" disabled>
          Estadisticas (Próximamente)
        </button>
        <button className="nav-link" type="button" disabled>
          Configuraciones (Próximamente)
        </button>
      </nav>

      <main className="app__main">
        <TablesGrid/>
      </main>
    </div>
  );
}

export default App;
