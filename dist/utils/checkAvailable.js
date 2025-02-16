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
exports.checkAvailability = void 0;
const Trx_1 = require("../models/Trx");
const checkAvailability = (userid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Trx_1.TxModel.findOne({ userid });
        if (!user) {
            // Can faucet
            return "good";
        }
        else {
            if (new Date().getTime() - user.last_updated_at.getTime() <
                24 * 60 * 60 * 1000) {
                // Can't faucet
                return "bad";
            }
            else {
                return "good";
            }
        }
    }
    catch (error) {
        console.error("Error in checking availability: ", error);
        return "failed";
    }
});
exports.checkAvailability = checkAvailability;
