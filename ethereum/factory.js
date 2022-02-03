import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const address = "0xA169039C945E1724E8478667E3C0d85CDc17D629" //address obtained after deploying the contract

const abi = CampaignFactory.abi;

export default new web3.eth.Contract(abi,address)