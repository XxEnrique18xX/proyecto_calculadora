import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

function Index() {
  return (
    <div>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card bg-light border" style={{ width: "60rem" }}>
          <div className="card-body text-center">
            <h1 className="card-title">Calculadora de programación lineal</h1>
            <p>Elija una opcion:</p>

            <div className="d-grid gap-2 mb-3" style={{ width: '400px', margin: '0 auto' }}>
                {/* Método SIMPLEX */}
                <Link to="/otra-pagina" className="btn btn-secondary">
                    Metodo SIMPLEX
                </Link>

                {/* Metodo ASIGNACION*/}
                <Link to="/otra-pagina" className="btn btn-secondary">
                    Metodo ASIGNACION
                </Link>

                {/* Metodo CPM*/}
                <Link to="/otra-pagina" className="btn btn-secondary">
                    Metodo C.P.M.
                </Link>

                {/* Métodos Gráficos */}
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Métodos Graficos
                    </button>
                    <ul className="dropdown-menu dropdown-menu-center text-center w-100" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <Link to="/grafico-maximizacion" className="dropdown-item">Gráfico - Maximización</Link>
                    </li>
                    <li>
                        <Link to="/otra-ruta" className="dropdown-item">Gráfico - Minimizacion</Link>
                    </li>
                    </ul>
                </div>
                
                {/* Métodos de transporte */}
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                    Métodos de transporte
                    </button>
                    <ul className="dropdown-menu dropdown-menu-center text-center w-100" aria-labelledby="dropdownMenuButton2">
                    <li>
                        <Link to="/grafico-maximizacion" className="dropdown-item">Esquina nor-oeste</Link>
                    </li>
                    <li>
                        <Link to="/otra-ruta" className="dropdown-item">Costo minimo</Link>
                    </li>
                    <li>
                        <Link to="/otra-ruta" className="dropdown-item">Vogel</Link>
                    </li>
                    </ul>
                </div>
            </div>
            <p className="card-text">
                <b><i>Diego Andres Baquiax Barrios - 202108036 | </i></b>
                <b><i>Miguel - Carnet | </i></b>
                <b><i>Enrique - Carnet | </i></b>
                <b><i>Diego - Carnet</i></b>
            </p>
            <p className="card-text"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;