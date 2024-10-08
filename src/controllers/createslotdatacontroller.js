import Slot from "../models/slotModel.js";
import catchAsync from "../helpers/catchAsync.js";
import Logger from "../initializers/logger.js";
import envHandler from "../helpers/envHandler.js";
import moment from "moment-timezone";
import fs from "fs";

const year = 2024;
const month = 2; // Months are indexed (Jan - 0, Feb - 1...)
const monthDays = [1, 2];
const hours = [10, 11, 12, 14, 15];
const mins = [0, 20, 40];
const curTimezone = 'Asia/Kolkata';
const targetTimezone = 'UTC';

const CreateSlotDataController = catchAsync(
    async (req, res) => {
        let {password} = req.body;
        if (password != envHandler('SUPERADMIN_PASS')) {
            Logger.info('Wrong password entered for creating data');
            return res.status(400).json({error: "Bad auth: You are not allowed to create data."});
        }
        for (let dy of monthDays) {
        for (let hr of hours) {
            for (let mn = 0; mn < mins.length; mn += 1) {
                let startTime = new moment.tz([year, month, dy, hr, mins[mn], 0], curTimezone).tz(targetTimezone).toDate();
                let finalmins;
                if (mins[mn] == 40) {
                    hr += 1;
                    finalmins = 0;
                } else {
                    finalmins = mins[mn + 1];
                }
                let endTime = new moment.tz([year, month, dy, hr, finalmins, 0], curTimezone).tz(targetTimezone).toDate();
                let day = 1;
                let isCarry = false;
                // if (hr == 16 && (mins[mn] < 30)) {
                //     continue;
                // }
                if (dy == 1) {
                    day = 2;
                }
                else if (dy == 2) {
                    day = 3;
                }
                // else {
                //     day = 3;
                // }
                // if (hr == 8 && (mins[mn] <= 30)) {
                //     isCarry = true;
                // }
                
                let newSlot = {
                    startTime: startTime,
                    endTime: endTime,
                    day: day,
                    isCarry: isCarry
                };

                await Slot.create([newSlot])
                .catch((err) => {
                    console.log(`Slot unable to be created: ${err}`);
                });
            }
        }
    }
        
        
        // for (let dy of monthDays) {
        //     const hr = 12;
        //     for (let mn = 0; mn < mins.length; mn += 2) {
        //         let startTime = new moment.tz([year, month, dy, hr, mins[mn], 0], curTimezone).tz(targetTimezone).toDate();
        //         let endTime = new moment.tz([year, month, dy, hr, mins[mn + 1], 0], curTimezone).tz(targetTimezone).toDate();
        //         let day = 1;
        //         if (dy == 22) {
        //             day = 1;
        //         } else if (dy == 23) {
        //             day = 2;
        //         } else {
        //             day = 3;
        //         }
        //         let newSlot = {
        //             startTime,
        //             endTime,
        //             day
        //         };
                
        //         await Slot.create([newSlot])
        //         .catch((err) => {
        //             Logger.error(`Error creating ${newSlot}: ${err.message}`);
        //             return res.status(500).json({error: "Unable to create additional slots."});
        //         })
        //         .then((slot) => {
        //             Logger.info(`Successfully created slot: ${slot}`);
        //         })
        //     }
        // }

        // let slots = await Slot.find({day: 1, toShow: false, isCarry: false})
        // .populate("slotBookedBy");
        // let structuredSlots = slots.map((slot) => {
        //     if (slot.slotBookedBy.length > 0) {
        //         const lastTime = new Date(2023, 8, 22, 12, 0, 0);
        //         if (slot.startTime.getTime() < lastTime.getTime()) {
        //             const userObjs = slot.slotBookedBy;
        //             const mails = userObjs.map((user) => {
        //                 return {phone: user.phoneno, email: user.email};
        //             });
        //             return {startTime: slot.startTime, users: mails};
        //         }
        //     }
        //     else{
        //         return undefined;
        //     }
        // });
        // structuredSlots = JSON.stringify(structuredSlots, null, 2);
        // fs.writeFileSync('userdata.js', structuredSlots);
        // res.download('userdata.js');
        // return res.status(200).json({message: "Slot data successfully created."});

        // for (let data of userdata) {
        //     const users = data.users;
        //     for (let user of users) {
        //         const mailOptions = {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'authorization': `Bearer ${envHandler('ADMIN_TOKEN')}`
        //             },
        //             body: JSON.stringify({email: user.email})
        //         }
        //         await fetch('https://lasertag-backend.csivit.com/admin-cancel-slot', mailOptions)
        //         .then((res) => {
        //             Logger.info(`Slot cancelled successfully for ${user.email}`);
        //         })
        //         .catch((err) => {
        //             Logger.error(`Unable to cancel slot for ${user.email}`);
        //         });
        //     }
        // }

        // await Slot.deleteMany({day: 3});
        // const day = 3;
        // for (let dy of monthDays) {
        //     for (let hr of hours) {
        //         for (let mn = 0; mn < mins.length; mn += 1) {
        //             let startTime = new moment.tz([year, month, dy, hr, mins[mn], 0], curTimezone).tz(targetTimezone).toDate();
        //             let finalmins;
        //             if (mins[mn] == 50) {
        //                 hr += 1;
        //                 finalmins = 0;
        //             } else {
        //                 finalmins = mins[mn + 1];
        //             }
        //             let endTime = new moment.tz([year, month, dy, hr, finalmins, 0], curTimezone).tz(targetTimezone).toDate();

        //             let newSlot = {
        //                 startTime,
        //                 endTime,
        //                 day
        //             };

        //             await Slot.create([newSlot])
        //             .catch((err) => {
        //                 Logger.error(`Error creating ${newSlot}: ${err.message}`);
        //                 return res.status(500).json({error: "Unable to create additional slots."});
        //             })
        //             .then((slot) => {
        //                 Logger.info(`Successfully created slot: ${slot}`);
        //             });
        //         }
        //     }
        // }

        return res.status(200).json({message: "New slots successfully created."});
});

export default CreateSlotDataController;