import { Link } from "react-router-dom";
import "../css/Home.css";

export const Home = () => {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>Martin Gelvan</h2>
            <p>Las mejores cosas en un solo mismo lugar</p>
          </div>
        </div>
      </section>

      <section className="cartas">
        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1512058564366-c9e8b12b5a59"
            alt="Gelvan Cocina"
            className="card-img"
          />
          <div className="card-body">
            <h5>Gelvan Cocina</h5>
            <p>Tus platos favoritos a un solo paso.</p>
            <Link to="/gelvancocina" className="btn">
              Ir a Gelvan Cocina
            </Link>
          </div>
        </div>

        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1516637090014-cb1ab0d08fc7"
            alt="Gifloox"
            className="card-img"
          />
          <div className="card-body">
            <h5>Gifloox</h5>
            <p>Regalá lo mejor a esa persona favorita.</p>
            <Link to="/gifloox" className="btn">
              Ir a Gifloox
            </Link>
          </div>
        </div>

        <div className="card">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
            alt="Servicio IT"
            className="card-img"
          />
          <div className="card-body">
            <h5>Servicio IT</h5>
            <p>¿Querés que te desarrolle una página web? Este es tu sitio.</p>
            <Link to="/gelvancocina"></Link>
          </div>
        </div>
      </section>
    </main>
  );
};
