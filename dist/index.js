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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const grammy_1 = require("grammy");
const checkAvailable_1 = require("./utils/checkAvailable");
const faucet_1 = require("./utils/faucet");
const updateDB_1 = require("./utils/updateDB");
const app = (0, express_1.default)();
dotenv_1.default.config();
// declare a route with a response
app.get("/", (req, res) => {
    res.send("What's up doc ?!");
});
// start the server
app.listen(process.env.BACK_PORT, () => {
    console.log(`Faucet bot is running : http://localhost:${process.env.BACK_PORT}`);
});
if (!process.env.BOT_TOKEN || !process.env.MONGODB_URI)
    process.exit(0);
// Connect MongoDB
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Mongo DB is connected"))
    .catch((err) => console.error("Mongo DB connection is failed"));
// Bot setup
const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userid = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id;
    const username = (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.username;
    if (!userid || !username)
        yield ctx.reply("Sorry, we can't get your user info. Please try again");
    // Check if telegram user is able to faucet tokens
    const isFaucetAllowed = yield (0, checkAvailable_1.checkAvailability)(String(userid));
    if (isFaucetAllowed === "good") {
        yield ctx.reply("Please enter your wallet address");
    }
    else {
        yield ctx.reply("You've already did faucet O3 Tokens. Please try again later.");
    }
}));
bot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const message = ctx.message.text;
    const userid = ctx.from.id;
    const username = ctx.from.username;
    if (!userid || !username) {
        yield ctx.reply("Sorry, we can't get your user info. Please try again");
        return;
    }
    // Check if telegram user is able to faucet tokens
    const isFaucetAllowed = yield (0, checkAvailable_1.checkAvailability)(String(userid));
    if (isFaucetAllowed !== "good") {
        yield ctx.reply("You've already did faucet O3 Tokens. Please try again later.");
        return;
    }
    if (!message || !faucet_1.web3.utils.isAddress(message)) {
        yield ctx.reply("Please enter the valid address");
    }
    else {
        yield ctx.reply("We're processing your request. Please wait...");
        const result = yield (0, faucet_1.faucet)(message);
        if (result === "success") {
            // Update Database
            yield (0, updateDB_1.updateTxRecord)(String(userid), username, message);
            yield ctx.reply("We've sent 5 O3 tokens to your wallet address. Thank you for using our faucet");
        }
        else {
            yield ctx.reply("Sorry. Internal server error. Please try again later.");
        }
    }
}));
bot.start();
