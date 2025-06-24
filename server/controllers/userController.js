// API Controller Funtion to Get User Bookings

import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res)=>{
    try {
        const user = req.auth().userId;

        const bookings = await Booking.find({user}).populate({
            path:"show",
            populate: {path: "movie"}
        }).sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message})
    }
}

//api controller funtion to update favorite movie in clerk user privateMetadata

export const updateFavorite = async (req, res)=>{
    try {
        const {movieId} = req.body;
        const userId = req.auth().userId;
        
        const user = await clerkClient.users.getUser(userId)

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = []
        }

         let action;
        
        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
            action = 'added';
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
            action = 'removed';
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata})

        res.json({success: true, message: `Movie ${action} to favorites successfully`, action})

    } catch (error) {
        console.error(error.message);
        res.json({success: false, message: error.message})
    }
}

export const getFavorites = async (req, res) =>{
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites;

        //get movies from Database
        const movies = await Movie.find({_id: {$in: favorites}})
        res.json({success:true, movies})
    } catch (error) {
        
console.error(error.message);
res.json({success: false, message: error.message})
    }
}