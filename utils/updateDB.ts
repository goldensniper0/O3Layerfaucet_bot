import { TxModel } from "../models/Trx";

export const updateTxRecord = async (
  userid: string,
  username: string,
  address: string
) => {
  if (!userid || !username || !address) {
    return "failed";
  }

  try {
    const user = await TxModel.findOne({ userid });

    if (!user) {
      await TxModel.create({
        userid,
        username,
        to: address,
      });

      return "success";
    } else {
      user.last_updated_at = new Date();
      await user.save();

      return "success";
    }
  } catch (error) {
    console.error("Error in updating tx record: ", error);
    return "failed";
  }
};
