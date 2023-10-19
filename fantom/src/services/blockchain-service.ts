import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { contractABI } from './contract.abi'
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

const concurrentContext = new Map();
/* 
  This function is calling FANTOM to write a json into blockchain
*/
export async function writeIntoBlockchain(jsonObject: any) {
  const web3 = new Web3(process.env.FANTOM_RPC_ENDPOINT); // Replace with the Fantom network RPC endpoint

  // Create a contract instance
  const contract = new Contract(contractABI, process.env.FANTOM_CONTRACT_ADDRESS);
  contract.setProvider(web3.currentProvider);

  const messageToEncrypt = JSON.stringify(jsonObject);

  let identifier = uuidv4();
  console.log(identifier)
  //DEVO CHIAMARE ZENROOM PRIMA PER GENERARE un nuovo messageToEncrypt
  //const encryptedJson = await encryptString(messageToEncrypt, identifier);

  //DEVO CONVERTIRE IN BASE64 
  //const base64ToSave = Buffer.from(JSON.stringify(encryptedJson)).toString('base64');
  const base64ToSave = Buffer.from(messageToEncrypt).toString('base64');

  // Create a transaction object
  const txObject = contract.methods.addSecret(identifier, base64ToSave);

  const fantomPrivateKey = process.env.FANTOM_WALLET_PRIVATE_KEY || '';

  // Get the account from the private key
  const account = web3.eth.accounts.privateKeyToAccount(fantomPrivateKey);
  web3.eth.accounts.wallet.add(account);

  // Send the transaction
  const gasPrice = await web3.eth.getGasPrice();
  const gas = await txObject.estimateGas({ from: account.address });
  const data = txObject.encodeABI();

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
    console.log('Transaction Hash:', receipt.transactionHash);
    console.log('Transaction Receipt:', receipt);

    return identifier;
  } catch (err) {
    console.log(".writeIntoBlockchain ERROR: Impossible to WRITE to FANTOM: ", err);
    throw err;
  }
}


/* 
  This function is calling FANTOM to read a json into blockchain
*/

export async function retrieveJsonFromBlockchain(identifier: string) {
  const web3 = new Web3(process.env.FANTOM_RPC_ENDPOINT); // Replace with the Fantom network RPC endpoint

  const contract = new Contract(contractABI, process.env.FANTOM_CONTRACT_ADDRESS);
  contract.setProvider(web3.currentProvider);

  try {
    // Call the retrieve method
    const contractString: string = await contract.methods.retrieve(identifier).call();
    const convertedString = Buffer.from(contractString, 'base64').toString('utf-8');
    //let resultingJSON = JSON.parse(convertedString)
    //resultingJSON = JSON.parse(convertedString)

    //const decodedString = await decryptString(resultingJSON.text, resultingJSON.checksum, resultingJSON.header, resultingJSON.iv, identifier);
    let decodedJSON = JSON.parse(convertedString);

    return decodedJSON;
  } catch (err) {
    console.log(".retrieveJsonFromBlockchain ERROR: Impossible to READ from FANTOM: ", err);
    throw err;
  }
}
