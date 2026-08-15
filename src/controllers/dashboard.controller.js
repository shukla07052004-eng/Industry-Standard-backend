import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { videoId, subscriptionId } = req.params
    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(subscriptionId)
            }
        },
        {
            $group: {
                _id: null,
                totalSubscribers: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalSubscribers: 1
            }
        }
    ]);

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $group: {
                _id: null,
                totalviews: {
                    $sum: "$views"
                },
                totalVideos: {
                    $sum: 1
                }
            }
        },
        {

            $project: {
                _id: 0,
                totalViews: 1,
                totalVideos: 1
            }
        }

    ])

    const likes = await Like.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $group: {
                _id: null,
                totallikes: {
                    $sum: "$likedBy"
                },

            }
        },
        {
            $project: {
                likedBy: totallikes
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    subscribers: subscribers[0]?.totalSubscribers || 0,
                    totalViews: videos[0]?.totalViews || 0,
                    totalVideos: videos[0]?.totalVideos || 0
                },
                "User channel stats fetched successfully"
            )
        );
})


export {
    getChannelStats,
    getChannelVideos
}