const hre = require("hardhat");

async function main() {
  // const Create = await hre.ethers.deployContract("PlayerToken", [
  //   "BaseToken",
  //   "Base",
  //   0,
  //   0,
  // ]);
  // await Create.waitForDeployment();

  // console.log("contract Address:", Create.target);

  const Create2 = await hre.ethers.deployContract("PlayerTokenAMM", [
    "0xDee3F1Ad0E5A2aAfDFC966fD574FD88E40F2f658",
    "0xCA53DeeD55e5309350F5B242eE74531E853dBf20",
  ]);
  await Create2.waitForDeployment();
  console.log("contract Address:", Create2.target);

  const Create3 = await hre.ethers.deployContract("BanterFantasySports", [
    "0xDee3F1Ad0E5A2aAfDFC966fD574FD88E40F2f658",
    Create2.target,
    "0xCA53DeeD55e5309350F5B242eE74531E853dBf20",
  ]);
  await Create3.waitForDeployment();

  console.log("contract Address:", Create3.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
