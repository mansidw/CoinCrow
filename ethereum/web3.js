import Web3 from "web3";
// window.ethereum.request({ method: "eth_requestAccounts" });

// const web3 = new Web3(window.ethereum);

let web3;
if(typeof window!=='undefined' && typeof window.ethereum!=='undefined'){
    //we are in browser and metamask running
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
}else{
    //we are not in browser i.e in the server or metamask is not running
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9c8ffdd853874b788609051b4cd2b7e2')

    web3 = new Web3(provider);

}

export default web3;
