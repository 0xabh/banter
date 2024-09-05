const hre = require("hardhat");

async function main() {
  const Create = await hre.ethers.deployContract("PlayerToken", [
    "BaseToken",
    "Base",
    0,
    0,
  ]);
  await Create.waitForDeployment();

  console.log("contract Address:", Create.target);

  const Create2 = await hre.ethers.deployContract("PlayerTokenAMM", [
    Create.target,
    "0xCA53DeeD55e5309350F5B242eE74531E853dBf20",
  ]);
  await Create2.waitForDeployment();
  console.log("contract Address:", Create2.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
