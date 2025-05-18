import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Index() {
  return (
    <div
      style={{
        backgroundColor: "#242728",
        minHeight: "100vh",
        padding: "40px 0",
      }}
    >
      <div className="container mt-5 d-flex justify-content-center">
        <div
          className="card border"
          style={{
            width: "60rem",
            backgroundColor: "#2d3133",
            color: "#7fc0f5",
          }}
        >
          <div className="card-body text-center">
            <h1 className="card-title" style={{ color: "#7fc0f5" }}>
              Calculadora de programación lineal
            </h1>
            <p style={{ color: "#7fc0f5" }}>Elija una opcion:</p>

            <div
              className="d-grid gap-2 mb-3"
              style={{ width: "400px", margin: "0 auto" }}
            >
              {/* Método SIMPLEX */}
              <Link
                to="/metodo-simplex"
                className="btn"
                style={{
                  backgroundColor: "#1972a7",
                  color: "#b3cdca",
                  border: "none",
                }}
              >
                Metodo SIMPLEX
              </Link>

              {/* Metodo ASIGNACION*/}
              <Link
                to="/metodo-asignacion"
                className="btn"
                style={{
                  backgroundColor: "#1972a7",
                  color: "#b3cdca",
                  border: "none",
                }}
              >
                Metodo ASIGNACION
              </Link>

              {/* Metodo CPM*/}
              <Link
                to="/metodo-cpm"
                className="btn"
                style={{
                  backgroundColor: "#1972a7",
                  color: "#b3cdca",
                  border: "none",
                }}
              >
                Metodo C.P.M.
              </Link>

              {/* Métodos Gráficos */}
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle w-100"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    backgroundColor: "#1972a7",
                    color: "#b3cdca",
                    border: "none",
                  }}
                >
                  Métodos Graficos
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-center text-center w-100"
                  aria-labelledby="dropdownMenuButton1"
                  style={{
                    backgroundColor: "#17191a",
                  }}
                >
                  <li>
                    <Link
                      to="/grafico-maximizacion"
                      className="dropdown-item"
                      style={{ color: "#7fc0f5", backgroundColor: "#17191a" }}
                    >
                      Gráfico - Maximización
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/grafico-minimizacion"
                      className="dropdown-item"
                      style={{ color: "#7fc0f5", backgroundColor: "#17191a" }}
                    >
                      Gráfico - Minimizacion
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Métodos de transporte */}
              <Link
                to="/metodo-transporte"
                className="btn"
                style={{
                  backgroundColor: "#1972a7",
                  color: "#b3cdca",
                  border: "none",
                }}
              >
                Metodo transporte
              </Link>
            </div>
            <p className="card-text" style={{ color: "#7fc0f5" }}>
              <b>
                <i>Desarrollado por:</i>
                <br />
                <i>Diego Fernando Carpio Alvarado - 202208041</i>
                <br />
                <i>Enrique Armando Rodriguez Tax - 202208049</i>
                <br />
                <i>Diego Andres Baquiax Barrios - 202108036</i>
                <br />
                <i>Miguel Angel Garcia Sapon - 202108056</i>
              </b>
            </p>
            <p className="card-text"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
