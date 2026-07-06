import BackgroundGradient from "./BackgroundGradient";
import GlobalOverlay from "./GlobalOverlay";
import TwinklingStars from "./TwinklingStars";
import FloatingParticles from "./FloatingParticles";
import MagicalMist from "./MagicalMist";
import FloatingCoins from "./FloatingCoins";

const MagicalBackground = () => {
  return (
    <>
      <BackgroundGradient />

      <GlobalOverlay />

      <TwinklingStars />

      <FloatingParticles />

      <MagicalMist />

      <FloatingCoins />
    </>
  );
};

export default MagicalBackground;