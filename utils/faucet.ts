import dotenv from "dotenv";
import Web3 from "web3";

dotenv.config();

import {
  arbRpcEndpoint,
  decimals,
  tokenContractAddress,
} from "../config/constants";

export const web3 = new Web3(new Web3.providers.HttpProvider(arbRpcEndpoint));

const adminPK = process.env.PUBLIC_KEY || "Your Public Key";
const adminPVK = process.env.PRIVATE_KEY || "Your Private Key";
const amount = process.env.AMOUNT;

export const faucet = async (to: string) => {
  if (!to || !amount) return "failed";

  try {
    const amountInFormat = web3.utils.toWei(amount, decimals);

    web3.eth.accounts.wallet.add(`0x${adminPVK}`);

    const abiArray = [
      {
        constant: false,
        inputs: [
          { name: "dst", type: "address" },
          { name: "wad", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        type: "function",
      },
    ];

    const contract = new web3.eth.Contract(abiArray, tokenContractAddress, {
      from: adminPK,
    });

    contract.methods.transfer(to, amountInFormat).send();

    await new Promise((f) => setTimeout(f, 5000));

    return "success";
  } catch (error) {
    console.error("Error in faucet tokens: ", error);
    return "failed";
  }
};
