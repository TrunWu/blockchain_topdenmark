var Claim = artifacts.require("Claim");
var FarmingInsurance = artifacts.require("FarmingInsurance");

module.exports = function(deployer) {
  deployer.deploy(FarmingInsurance);
  deployer.deploy(Claim);
};
