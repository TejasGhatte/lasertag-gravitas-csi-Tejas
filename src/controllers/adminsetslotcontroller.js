import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import Slot from "../models/slotModel.js";

const AdminSetSlotController = catchAsync(
    async (req, res) => {
        let {slotId} = req.body;
        let {adminMail} = req.admin;

        if (!slotId) {
            Logger.error(`Invalid slotId or email entered by ADMIN ${adminMail}`);
            return res.status(400).json({error: "Invalid slotId or email."});
        }

        const slot = await Slot.findById(slotId);

        if (!slot) {
            Logger.info("Invalid Slot ID for Slot state change.");
            return res.status(400).json({error: "Invalid Slot ID for Slot state change."});
        }

        slot.toShow = !(slot.toShow);
        await slot.save();
        Logger.info(`${adminMail} changed state of ${slot} to ${slot.toShow}.`);
        return res.status(200).json({message: "Successfully changed state of selected slot."});
    }
);

export default AdminSetSlotController;