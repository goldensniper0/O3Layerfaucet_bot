import mongoose from "mongoose";

const Schema = mongoose.Schema;

const txSchema = new Schema({
  userid: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const TxModel = mongoose.model("txs", txSchema);
