import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Bot } from "grammy";
import { checkAvailability } from "./utils/checkAvailable";
import { faucet, web3 } from "./utils/faucet";
import { updateTxRecord } from "./utils/updateDB";

const app = express();
dotenv.config();

// declare a route with a response
app.get("/", (req, res) => {
  res.send("What's up doc ?!");
});

// start the server
app.listen(process.env.BACK_PORT, () => {
  console.log(
    `Faucet bot is running : http://localhost:${process.env.BACK_PORT}`
  );
});

if (!process.env.BOT_TOKEN || !process.env.MONGODB_URI) process.exit(0);

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Mongo DB is connected"))
  .catch((err) => console.error("Mongo DB connection is failed"));

// Bot setup
const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", async (ctx) => {
  const userid = ctx.from?.id;
  const username = ctx.from?.username;

  if (!userid || !username)
    await ctx.reply("Sorry, we can't get your user info. Please try again");

  // Check if telegram user is able to faucet tokens
  const isFaucetAllowed = await checkAvailability(String(userid));

  if (isFaucetAllowed === "good") {
    await ctx.reply("Please enter your wallet address");
  } else {
    await ctx.reply(
      "You've already did faucet O3 Tokens. Please try again later."
    );
  }
});

bot.on("message", async (ctx) => {
  const message = ctx.message.text;
  const userid = ctx.from.id;
  const username = ctx.from.username;

  if (!userid || !username) {
    await ctx.reply("Sorry, we can't get your user info. Please try again");
    return;
  }

  // Check if telegram user is able to faucet tokens
  const isFaucetAllowed = await checkAvailability(String(userid));
  if (isFaucetAllowed !== "good") {
    await ctx.reply(
      "You've already did faucet O3 Tokens. Please try again later."
    );

    return;
  }

  if (!message || !web3.utils.isAddress(message)) {
    await ctx.reply("Please enter the valid address");
  } else {
    await ctx.reply("We're processing your request. Please wait...");

    const result = await faucet(message);
    if (result === "success") {
      // Update Database
      await updateTxRecord(String(userid), username, message);

      await ctx.reply(
        "We've sent 5 O3 tokens to your wallet address. Thank you for using our faucet"
      );
    } else {
      await ctx.reply("Sorry. Internal server error. Please try again later.");
    }
  }
});

bot.start();
