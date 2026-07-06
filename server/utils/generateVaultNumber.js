const generateVaultNumber = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let vaultNumber = "GR-";

  for (let i = 0; i < 8; i++) {
    vaultNumber += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return vaultNumber;
};

export default generateVaultNumber;