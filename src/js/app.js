App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Claim.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var ClaimArtifact = data;
      App.contracts.Claim = TruffleContract(ClaimArtifact);

      // Set the provider for our contract.
      App.contracts.Claim.setProvider(App.web3Provider);

      return App.getRequests();
    });

    return App.bindEvents();
  },


  getRequests: function() {
    console.log('Getting request...');

    var claimInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Claim.deployed().then(function(instance) {
        claimInstance = instance;

        return claimInstance.getRequest(0);
      }).then(function(requests) {
        console.log(requests[0]);
        var reqs = [];
        for (i = 0; i < requests.length; i ++){
          reqs[i] = requests[i].c[0];
        }
        // console.log(reqs);
        // req = requests.c[0];
        $('#Claimhistory').text(reqs);
      }).catch(function(err) {
        console.log(err.message);
      });
    });

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Claim.deployed().then(function(instance) {
        claimInstance = instance;

        return claimInstance.getRequest(1);
      }).then(function(requests) {
        console.log(requests[0]);
        var reqs = [];
        for (i = 0; i < requests.length; i ++){
          reqs[i] = requests[i].c[0];
        }
        // console.log(reqs);
        // req = requests.c[0];
        $('#TOBECHECK').text(reqs);
      }).catch(function(err) {
        console.log(err.message);
      });
    });

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Claim.deployed().then(function(instance) {
        claimInstance = instance;

        return claimInstance.getRequest(2);
      }).then(function(requests) {
        console.log(requests[0]);
        var reqs = [];
        for (i = 0; i < requests.length; i ++){
          reqs[i] = requests[i].c[0];
        }
        // console.log(reqs);
        // req = requests.c[0];
        $('#TOBEREPLY').text(reqs);
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  },


  bindEvents: function() {
    $(document).on('click', '#RegisterClaim', App.registerClaim);
    $(document).on('click', '#CheckClaim', App.vetcheck);
    $(document).on('click', '#ReplyClaim', App.insuranceReply);
  },

  registerClaim: function(event) {
    event.preventDefault();
    var cowId = parseInt($('#COWID').val());
    var today = new Date();
    var date = parseInt(today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate());
    
    var claimInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Claim.deployed().then(function(instance) {
        claimInstance = instance;
        
        return claimInstance.initRequest(cowId, date, {from: account});
        
        // return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        console.log(result);  
        return App.getRequests();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  vetcheck: function(event) {
    event.preventDefault();
    var requestId = parseInt($('#RequestId').val());
    var check = parseInt($('#CHECK').val());
    var today = new Date();
    var date = parseInt(today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate());
    var is_sick;

    if (check == 0){
      is_sick = true;
    } else {
      is_sick = false;
    }
    
    alert("id:" + requestId + " check:" + is_sick + " date:" + date);
    
    // var toAddress = $('#TTTransferAddress').val();

    // console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var claimInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Claim.deployed().then(function(instance) {
        claimInstance = instance;
        
        return claimInstance.vetCheck(is_sick, requestId, date, {from: account});
        
        // return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.getRequests();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  insuranceReply: function(event) {
    event.preventDefault();
    var requestId = parseInt($('#CheckedId').val());
    var reply = parseInt($('#Reply').val());
    var today = new Date();
    var date = parseInt(today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate());
    var accept;

    if (reply == 0){
      accept = true;
    } else {
      accept = false;
    }
    
    
    // var toAddress = $('#TTTransferAddress').val();

    // console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var claimInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Claim.deployed().then(function(instance) {
        claimInstance = instance;
        
        return claimInstance.replayClaim(accept, requestId, date, {from: account});
        
        // return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.getRequests();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
