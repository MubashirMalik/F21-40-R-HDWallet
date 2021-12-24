const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');

let tokens = ['ec790a0d69bfff757a751af3','61c06967489564bc7c015e9b','62914f56fbdad91e6a4aea15',
                '862c762c087317faec548594','9bd874cbb9cc80ada7a758d4','e8ffabf2ec350398b86a023f'];

let serverAPIs = ['https://eth-mainnet.alchemyapi.io/v2/LWVoVI0-n9Z7V-Yh5AP6SEbmVP4is7e-',
                  'https://speedy-nodes-nyc.moralis.io/ec790a0d69bfff757a751af3/eth/mainnet',
                  'https://speedy-nodes-nyc.moralis.io/862c762c087317faec548594/eth/mainnet',
                  'https://speedy-nodes-nyc.moralis.io/9bd874cbb9cc80ada7a758d4/eth/mainnet',
                  'https://speedy-nodes-nyc.moralis.io/e8ffabf2ec350398b86a023f/eth/mainnet',
                  'https://49b6eb9433f649c7b87d9f95615147bd.eth.rpc.rivet.cloud/',
                  'https://5d2480e77ff545548e8a0e10bf3f1f84.eth.rpc.rivet.cloud/',
                  'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79',
                  'https://mainnet-nethermind.blockscout.com/',
                  'https://api.mycryptoapi.com/eth'];

function getServer(apilink){
  var web3Provider = new Web3.providers.HttpProvider(apilink);
  return new Web3(web3Provider);
}

async function main(){

  var serverList = [];
  const serverCount = 10;
  for (let i =0 ; i < serverCount; i++){
    serverList.push(getServer(serverAPIs[i]));
    const latest = await serverList[i].eth.getBlock('latest');
    console.log(i+1,": ",latest.hash);
  }
  var heaviest = 0;
  var height = 0;
  for (let i = 0 ; i < serverCount; i++){
    const latest = await serverList[i].eth.getBlock('latest');
    const blockheight = latest.number;
    if(blockheight > height){
      heaviest = i;
      height = blockheight;
    }
  }
  const latest = await serverList[heaviest].eth.getBlock('latest');
  console.log("Block Details");
  console.log(latest);
  getTransactionsByAccount(serverList[heaviest],"0x25FDe884481597170e21CEBa0e2046590cA6B312");
}
//Get the transaction history of a wallet using the wallet address
async function getTransactionsByAccount(web3, myaccount, startBlockNumber, endBlockNumber) {
  var txList = [];
  if (endBlockNumber == null) {
    endBlockNumber = await web3.eth.getBlockNumber();
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 200;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for transactions to/from account \"" + myaccount +
                 "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    console.log("Searching block " + i);
    var block = await web3.eth.getBlock(i);
    if (block != null && block.transactions != null) {
      block.transactions.forEach(async function(tx) {
        e = await web3.eth.getTransaction(tx);
        //console.log(e.from, "  -------  ",e.to);
        if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
          txList.push(e);
          console.log("  tx hash          : " + e.hash + "\n"
            + "   nonce           : " + e.nonce + "\n"
            + "   blockHash       : " + e.blockHash + "\n"
            + "   blockNumber     : " + e.blockNumber + "\n"
            + "   transactionIndex: " + e.transactionIndex + "\n"
            + "   from            : " + e.from + "\n"
            + "   to              : " + e.to + "\n"
            + "   value           : " + e.value + "\n"
            + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
            + "   gasPrice        : " + e.gasPrice + "\n"
            + "   gas             : " + e.gas + "\n"
            + "   input           : " + e.input);
        }
      })
    }
  }
  return txList;
}

async function verify(web3, account,txList){
  var cal_balance = 0;
  for(tx in txList){
    if(tx.to == account){
      cal_balance += tx.value;
    }
    else{
      cal_balance -= tx.value;
    }
  }
  var balance = web3.eth.getBalance(account);
  return balance == cal_balance;
}

main();
