"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faucet = exports.web3 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const web3_1 = __importDefault(require("web3"));
dotenv_1.default.config();
const constants_1 = require("../config/constants");
exports.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(constants_1.arbRpcEndpoint));
const adminPK = process.env.PUBLIC_KEY || "Your Public Key";
const adminPVK = process.env.PRIVATE_KEY || "Your Private Key";
const amount = process.env.AMOUNT;
const faucet = (to) => __awaiter(void 0, void 0, void 0, function* () {
    if (!to || !amount)
        return "failed";
    try {
        const amountInFormat = exports.web3.utils.toWei(amount, constants_1.decimals);
        exports.web3.eth.accounts.wallet.add(`0x${adminPVK}`);
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
        const contract = new exports.web3.eth.Contract(abiArray, constants_1.tokenContractAddress, {
            from: adminPK,
        });
        contract.methods.transfer(to, amountInFormat).send();
        yield new Promise((f) => setTimeout(f, 5000));
        return "success";
    }
    catch (error) {
        console.error("Error in faucet tokens: ", error);
        return "failed";
    }
});
exports.faucet = faucet;
