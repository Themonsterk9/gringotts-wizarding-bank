import { Link, useNavigate } from "react-router-dom";

import PageTransition from "../../components/animation/PageTransition";
import AnimatedButton from "../../components/animation/AnimatedButton";

import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="notfound-page">

        <div className="notfound-card">

          <h1 className="error-code">
            404
          </h1>

          <h2>
            🏦 Lost in the Forbidden Vaults
          </h2>

          <p>
            The magical page you're looking for has
            disappeared deep inside Gringotts.
          </p>

          <div className="notfound-buttons">

            <Link to="/">
              <AnimatedButton>
                🏠 Return Home
              </AnimatedButton>
            </Link>

            <AnimatedButton
              className="secondary"
              onClick={() => navigate(-1)}
            >
              ⬅ Go Back
            </AnimatedButton>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;