import "./FloatingCoins.css";

const COINS = Array.from({ length: 5 });

const FloatingCoins = () => {
  return (
    <div className="coins-container">

      {COINS.map((_, index) => (

        <div
          key={index}
          className="coin"
          style={{
            left: `${15 + index * 18}%`,
            animationDelay: `${index * 8}s`,
            animationDuration: `${30 + index * 4}s`,
          }}
        >

          🪙

        </div>

      ))}

    </div>
  );
};

export default FloatingCoins;