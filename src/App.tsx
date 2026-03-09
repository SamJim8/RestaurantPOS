import { useState } from "react";
import { TablesGrid } from "./features/tables/components/TablesGrid/TablesGrid";
import "./styles/App.css";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="app">
      <button
        className="nav-toggle"
        type="button"
        onClick={() => setIsNavOpen((prev) => !prev)}
        aria-expanded={isNavOpen}
        aria-controls="main-navigation"
        aria-label={isNavOpen ? "Cerrar navegación" : "Abrir navegación"}
      >
        <span className="nav-toggle__line" />
        <span className="nav-toggle__line" />
        <span className="nav-toggle__line" />
      </button>

      {isNavOpen ? (
        <button
          className="nav-backdrop"
          type="button"
          aria-label="Cerrar navegación"
          onClick={() => setIsNavOpen(false)}
        />
      ) : null}

      <div className="app__layout">
        <nav
          id="main-navigation"
          className={`app__nav ${isNavOpen ? "app__nav--open" : ""}`}
          aria-label="Navegación principal"
        >
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
          <header className="app__header">
            <h1>Restaurant POS</h1>
            <p>Gestión de restaurante</p>
          </header>
          <TablesGrid />
        </main>
      </div>
    </div>
  );
}

export default App;
