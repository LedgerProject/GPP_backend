import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { contractABI } from './contract.abi'
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

/* 
  This function is calling FANTOM to write a json into blockchain
*/
export async function writeIntoBlockchain(jsonObject: any) {
  const web3 = new Web3(process.env.FANTOM_RPC_ENDPOINT);

  // Create a contract instance
  const contract = new Contract(contractABI, process.env.FANTOM_CONTRACT_ADDRESS);
  contract.setProvider(web3.currentProvider);

  const messageToEncrypt = JSON.stringify(jsonObject);

  let identifier = uuidv4();
  const base64ToSave = Buffer.from(messageToEncrypt).toString('base64');

  // Create a transaction object
  const txObject = contract.methods.addSecret(identifier, base64ToSave);

  const fantomPrivateKey = process.env.FANTOM_WALLET_PRIVATE_KEY || '';
  const maxFTMToSpend = Number(process.env.MAX_FTM_TO_SPEND ?? 0.10);

  // Get the account from the private key
  const account = web3.eth.accounts.privateKeyToAccount(fantomPrivateKey);
  web3.eth.accounts.wallet.add(account);

  // Send the transaction
  const gasPrice = await web3.eth.getGasPrice();
  const gas = await txObject.estimateGas({ from: account.address });
  const data = txObject.encodeABI();
  const estimatedTxInFTM: number = Number(gasPrice * gas) * 0.000000000000000001;

  if (estimatedTxInFTM <= maxFTMToSpend) {
    const tx: any = {
      from: account.address,
      to: process.env.FANTOM_CONTRACT_ADDRESS,
      gas,
      gasPrice,
      data,
    };

    try {
      const signedTx = await web3.eth.accounts.signTransaction(tx, fantomPrivateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      return identifier;
    } catch (err) {
      console.log(".writeIntoBlockchain ERROR: Impossible to WRITE to FANTOM: ", err);
      throw err;
    }
  } else {
    console.log(`.writeIntoBlockchain: Actual FTM price ${estimatedTxInFTM} is too expensive, we'll try when it's cheaper `);
    throw "Too expensive";
  }

}


/* 
  This function is calling FANTOM to read a json from blockchain
*/

export async function retrieveJsonFromBlockchain(identifier: string) {
  const web3 = new Web3(process.env.FANTOM_RPC_ENDPOINT);

  const contract = new Contract(contractABI, process.env.FANTOM_CONTRACT_ADDRESS);
  contract.setProvider(web3.currentProvider);

  try {
    // Call the retrieve method
    const contractString: string = await contract.methods.retrieve(identifier).call();
    const convertedString = Buffer.from(contractString, 'base64').toString('utf-8');

    return JSON.parse(convertedString);
  } catch (err) {
    console.log(".retrieveJsonFromBlockchain ERROR: Impossible to READ from FANTOM: ", err);
    throw err;
  }
}
