import { Inngest } from "inngest";
import User from "../models/User.js";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";
dotenv.config()


export const inngest = new Inngest({ id: "movie-ticket-booking" });

//innegest funtion to save user data to a Database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk',
        timeout:30,
    },
    { event: 'clerk/user.created' },
    async({ event })=>{
        const{id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name:first_name + ' ' + last_name,
            image: image_url
        }
        await User.create(userData);
    }
)


const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    { event: 'clerk/user.deleted' },
    async({ event })=>{
        const{id} = event.data
        
        await User.findByIdAndDelete(id);
    }
)


const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    { event: 'clerk/user.updated' },
    async({ event })=>{

        const{id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image:image_url
        }
        await User.findByIdAndUpdate(id, userData);
    }
);

//changes for reserve seat for 10 minutes if payment not made

const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: 'app/checkpayment' },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);
            // If payment is not made, release seats and delete booking
            if (!booking.isPaid) {
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat) => {
                    delete show.occupiedSeats[seat];
                });
                show.markModified('occupiedSeats');
                await show.save();
                await Booking.findByIdAndDelete(booking._id);
            }
        });
    }
);

const sendBookingConfirmationEmail = inngest.createFunction(
    { id: "send-booking-confirmation-email" },
    { event: "app/show.booked" },
    async ({ event, step }) => {
        const { bookingId } = event.data;
        const booking = await Booking.findById(bookingId).populate({ path: "show", populate: { path: "movie", model: "Movie" } }).populate("user");
        // Add your email sending logic here
        await sendEmail({
            to: booking.user.email,
            subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
            body: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hi ${booking.user.name},</h2>
                    <p>Your booking for <strong style="color: #F84565;">${booking.show.movie.title}</strong> is confirmed.</p>
                    <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
                    <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
                    <p>Thanks for booking with us!<br/>— OmniTicks Team</p>
                    </div>
                    `
        });
    }
);

// Inngest Function to send reminders
const sendShowReminders = inngest.createFunction(
    { id: "send-show-reminders", cron: "0 */8 * * *" }, // Every 8 hours
    {},
    async ({ step }) => {
        const now = new Date();
        const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now

        // Find shows starting between 10 minutes and 8 hours from now
        const shows = await Show.find({
            showDateTime: { $gte: windowStart, $lte: in8Hours }
        }).populate('movie');

        const reminderTasks = [];

        for (const show of shows) {
            if (!show.movie || !show.occupiedSeats) continue;
            const userIds = [...new Set(Object.values(show.occupiedSeats))];
            if (!userIds.length) continue;
            const users = await User.find({ _id: { $in: userIds } }, "email name");
            for (const user of users) {
                reminderTasks.push({
                    userEmail: user.email,
                    userName: user.name,
                    movieTitle: show.movie.title,
                    showTime: show.showDateTime
                });
            }
        }

        if (reminderTasks.length === 0) {
            return { sent: 0, failed: 0, message: "No reminders to send." };
        }

        // Send reminder emails
        const results = await step.run('send-all-reminders', async () => {
            return await Promise.allSettled(
                reminderTasks.map(task =>
                    sendEmail({
                        to: task.userEmail,
                        subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
                        body: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 20px;">
                                <h2>Hello ${task.userName},</h2>
                                <p>This is a quick reminder that your movie:</p>
                                <h3 style="color: #F84565;">"${task.movieTitle}"</h3>
                                is scheduled for <strong>${new Date(task.showTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}</strong> at
                                <strong>${new Date(task.showTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}</strong> - make sure you're ready!</p>
                                <br/>
                                <p>Enjoy the show!<br/>OmniTicks Team</p>
                            </div>
                        `
                    })
                )
            );
        });

        const sent = results.filter(r => r.status === "fulfilled").length;
        const failed = results.length - sent;
        return {
            sent,
            failed,
            message: `Sent ${sent} reminder(s), ${failed} failed.`
        };
    }
);

// Inngest Function to send notifications when a new show is added
const sendNewShowNotifications = inngest.createFunction(
    { id: "send-new-show-notifications" },
    { event: "app/show.added" },
    async ({ event }) => {
        const { movieTitle } = event.data;
        const users = await User.find({});
        let sent = 0, failed = 0;

        for (const user of users) {
            const userEmail = user.email;
            const userName = user.name;
            const subject = "New Show Added: " + movieTitle;
            const body = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hi ${userName},</h2>
                    <p>We've just added a new show to our library:</p>
                    <h3 style="color: #F84565;">"${movieTitle}"</h3>
                    <p>Visit our website to book your tickets now!</p>
                    <br/>
                    <p>Thanks,<br/>OmniTicks Team</p>
                </div>
            `;
            try {
                await sendEmail({
                    to: userEmail,
                    subject,
                    body,
                });
                sent++;
            } catch (e) {
                failed++;
            }
        }
        return {
            message: `Notifications sent: ${sent}, failed: ${failed}`,
            sent,
            failed,
        };
    }
);


export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendShowReminders,
    sendNewShowNotifications
];