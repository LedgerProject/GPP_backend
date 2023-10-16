import Web3 from 'web3';
import { FANTOM_RPC_ENDPOINT, FANTOM_CONTRACT_ADDRESS, FANTOM_WALLET_PRIVATE_KEY } from "../constants";
import { encryptString, decryptString } from '../services/zenroom-service';
const web3 = new Web3(FANTOM_RPC_ENDPOINT); // Replace with the Fantom network RPC endpoint
import { Contract } from 'web3-eth-contract';

const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "name": "addSecret",
    "inputs": [
      {
        "internalType": "string",
        "name": "_id",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_secret",
        "type": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_id",
        "type": "string"
      }
    ],
    "name": "retrieve",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

/* 
  This function is calling SAWROOM to write a json into blockchain
*/
export async function writeIntoBlockchain(jsonObject: any, identifier: string) {

  // Create a contract instance
  const contract = new web3.eth.Contract(contractABI, FANTOM_CONTRACT_ADDRESS);
  contract.setProvider(web3.currentProvider);

  const messageToEncrypt = JSON.stringify(jsonObject);

  //DEVO CHIAMARE ZENROOM PRIMA PER GENERARE un nuovo messageToEncrypt
  const encryptedJson = await encryptString(messageToEncrypt, identifier);

  //DEVO CONVERTIRE IN BASE64 
  const base64ToSave = Buffer.from(JSON.stringify(encryptedJson)).toString('base64');

  // Create a transaction object
  const txObject = contract.methods.addSecret(identifier, base64ToSave);

  // Get the account from the private key
  const fantomPrivateKey = FANTOM_WALLET_PRIVATE_KEY || '';
  const account = web3.eth.accounts.privateKeyToAccount(fantomPrivateKey);
  web3.eth.accounts.wallet.add(account);

  // Send the transaction
  const gas = await txObject.estimateGas({ from: account.address });
  const gasPrice = await web3.eth.getGasPrice();
  const data = txObject.encodeABI();

  const tx: any = {
    from: account.address,
    to: FANTOM_CONTRACT_ADDRESS,
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
    console.log(".writeIntoBlockchain ERROR: Impossible to WRITE to SAWROOM: ", err);
  }
}


/* 
  This function is calling SAWROOM to read a json into blockchain
*/
export async function retrieveJsonFromBlockchain(identifier: string) {

  const contract = new web3.eth.Contract(contractABI, FANTOM_CONTRACT_ADDRESS);
  contract.setProvider(web3.currentProvider);

  try {
    // Call the retrieve method
    const contractString: string = await contract.methods.retrieve(identifier).call();
    const convertedString = Buffer.from(contractString, 'base64').toString('utf-8');
    const resultingJSON = JSON.parse(convertedString);

    const decodedString = await decryptString(resultingJSON.text, resultingJSON.checksum, resultingJSON.header, resultingJSON.iv, identifier);
    const decodedJSON = JSON.parse(decodedString);

    return decodedJSON;
  } catch (err) {
    console.log(".retrieveJsonFromBlockchain ERROR: Impossible to READ from FANTOM: ", err);
  }
}