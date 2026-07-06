import { Link } from "react-router-dom";

import "./Home.css";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedButton from "../../components/animation/AnimatedButton";

const Home = () => {
  return (
    <PageTransition>
      <div className="home">

        <header className="hero">

          <h1>🏦 Gringotts Wizarding Bank</h1>

          <p>
            The safest place in the wizarding world for your
            Galleons, Sickles, and Knuts.
          </p>

          <div className="hero-buttons">

            <Link to="/login">
              <AnimatedButton>
                Login
              </AnimatedButton>
            </Link>

            <Link to="/register">
              <AnimatedButton className="secondary">
                Register
              </AnimatedButton>
            </Link>

          </div>

        </header>

        <section className="features">

          <div className="feature-card">
            <h2>🔒 Secure Vaults</h2>

            <p>
              Every wizard gets a magical vault protected by
              Gringotts security.
            </p>
          </div>

          <div className="feature-card">
            <h2>⚡ Instant Transfers</h2>

            <p>
              Transfer Galleons safely between wizard vaults.
            </p>
          </div>

          <div className="feature-card">
            <h2>📜 Transaction History</h2>

            <p>
              View your complete magical banking history.
            </p>
          </div>

        </section>

      </div>
    </PageTransition>
  );
};

export default Home;