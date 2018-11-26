
var Farm = artifacts.require('FarmingInsurance');


contract('FarmingInsurance', function(accounts) {
  it("should start with no cows", async () => {
    let instance = await Farm.deployed();
    let numberOfCows = await instance.numberOfCows.call(accounts[0]);
    assert.equal(numberOfCows.valueOf(), 0);
  });
  
  it("should have one cow after cow added", async () => {
    let instance = await Farm.deployed();

    await instance.newCow('Cow1',{from: accounts[0]});
    let numberOfCows = await instance.numberOfCows.call(accounts[0]);
    assert.equal(numberOfCows.valueOf(), 1);
  });
  it("should emit event", async() => {
    let instance = await Farm.deployed();
    let watcher = instance.CowEvent();
    await instance.newCow("Cow1");
    await instance.newCow("Cow2");
    await instance.newCow("Cow3");
    await instance.cowIncident(accounts[0],2,"Cow got sick");
    let events = await watcher.get();
    assert.equal(events.length, 1);
    //console.log(events[0].args);
    assert.equal(events[0].args.cowID.valueOf(), 2);
    assert.equal(events[0].args.farm.valueOf(), accounts[0]);
  });
});
