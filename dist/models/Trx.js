"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
exports.TxModel = mongoose_1.default.model("txs", txSchema);
