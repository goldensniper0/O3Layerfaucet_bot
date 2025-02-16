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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTxRecord = void 0;
const Trx_1 = require("../models/Trx");
const updateTxRecord = (userid, username, address) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userid || !username || !address) {
        return "failed";
    }
    try {
        const user = yield Trx_1.TxModel.findOne({ userid });
        if (!user) {
            yield Trx_1.TxModel.create({
                userid,
                username,
                to: address,
            });
            return "success";
        }
        else {
            user.last_updated_at = new Date();
            yield user.save();
            return "success";
        }
    }
    catch (error) {
        console.error("Error in updating tx record: ", error);
        return "failed";
    }
});
exports.updateTxRecord = updateTxRecord;
