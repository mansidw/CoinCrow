const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3')
const compiledFactory = require("./build/CampaignFactory.json");


const provider = new HDWalletProvider(
    process.env.SECRET,
    process.env.INFURA_URL
);

const web3 = new Web3(provider);


const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account",accounts[0]);

    try{
        const factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: "3000000" });

        console.log('Contract deployed to: ',factory.options.address);

        provider.engine.stop()
    }catch(err){
        console.log(err);
    }

}
deploy();

