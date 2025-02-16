import { TxModel } from "../models/Trx";

export const checkAvailability = async (userid: string) => {
  try {
    const user = await TxModel.findOne({ userid });

    if (!user) {
      // Can faucet
      return "good";
    } else {
      if (
        new Date().getTime() - user.last_updated_at.getTime() <
        24 * 60 * 60 * 1000
      ) {
        // Can't faucet
        return "bad";
      } else {
        return "good";
      }
    }
  } catch (error) {
    console.error("Error in checking availability: ", error);
    return "failed";
  }
};
