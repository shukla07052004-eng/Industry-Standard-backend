import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {


    // Get videos from MongoDB (their Cloudinary URLs are already stored in the database)
    // Apply filters (query, userId)
    // Apply sorting
    // Apply pagination
    // Return the videos in the response
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const sortField = sortBy || "updatedAt";
    const order = sortType === "asc" ? 1 : -1;

    const skip = (pageNum - 1) * limitNum;

    const match = {
        ...(userId && {
            owner: new mongoose.Types.ObjectId(userId)
        }),

        ...(query && {
            $or: [
                {
                    title: {
                        $regex: query,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        })
    };

    const videos = await Video.aggregate([

        {
            $match: match
        },

        {
            $sort: {
                [sortField]: order
            },
        },
        { $skip: skip },
        { $limit: limitNum },

        {
            $project: {
                description: 1,
                title: 1,
                videoFile: 1,
                thumbnail: 1,
                duration: 1
            }

        }

    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "get all the videos")
        )


    // ANOTHER WAY TO WRITE SAME PIPELINE USING "if" STATEMENT OUTSIDE PIPLINE    

    // const pagenum = Number(page)
    // const limitnum = Number(limit)

    // const skip = (pagenum - 1) * limitnum;

    // const pipeline = []


    // if (query) {
    //     pipeline.push(
    //         {
    //             $match: {
    //                 $or: {

    //                     title: {
    //                         $regex: query,
    //                         $options: "i"
    //                     },
    //                     discription: {
    //                         $regex: query,
    //                         $options: "i"
    //                     }
    //                 }
    //             }
    //         }
    //     )
    // }
    // if (userId) {
    //     pipeline.push(
    //         {
    //             $match: {
    //                 owner: new mongoose.Types.ObjectId(userId)
    //             }
    //         }
    //     )
    // }

    // const sortBy = "updateAt";
    // const sortType = "asc";

    // pipeline.push({
    //     $sort: {
    //         [sortBy]: sortType === "asc"? 1 : -1
    //     }
    // })

    // const videos = (await Video.aggregate(pipeline))
    // return res
    //     .status(200)
    //     .json(
    //         new ApiResponse(200, videos, "get all the videos")
    //     )

})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    // get the local path of the videofile
    // upload it to the claudinary
    // save url to database
    // return response to user with title and discription
    const { title, description } = req.body

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title and description are required");
    }

    const LocalVideoFilePath = req.files?.videoFile?.[0].path;
    const LocalThumbnailPath = req.files?.thumbnail?.[0].path;

    if (!LocalVideoFilePath) {
        throw new ApiError(400, "video file is required")
    }
    if (!LocalThumbnailPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const video = await uploadOnCloudinary(LocalVideoFilePath)
    const thumbnail = await uploadOnCloudinary(LocalThumbnailPath)

    if (!video || !thumbnail) {
        throw new ApiError(404, "videoFile is not uploded on claudinary")
    }

    const createvideo = await Video.create({
        title,
        description,
        videoFile: video.secure.url,
        duration: video.duration,
        thumbnail: thumbnail.secure.url,
        owner: req.user?._id

    })

    return res.status(201)
        .json(
            new ApiResponse(201, createvideo, "video file is uploaded successfully")
        )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    await Video.updateOne(
        { _id: videoId },
        {
            $inc: {
                views: 1
            }
        }
    );

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                description: 1,
                title: 1,
                videoFile: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                owner: 1
            }
        }

    ]
    )

    if (!video.length) {
        throw new ApiError(404, "Video not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "details of video is finally fetched")
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const {title, description} = req.body
    if(!(title || description)){
        throw new ApiError(404, "error, fields are required")
    }

    const LocalThumbnailPath = req.file.path

    if(!LocalThumbnailPath){
        throw new ApiError(400, "error,  Thumbnail is missing")
    }

    const Thumbnail = uploadOnCloudinary(LocalThumbnailPath)
    if(!Thumbnail.url){
        throw new ApiError(400, "error, Claudinary upload failed" )
    }

    const video = await Video.findByIdAndUpdate(
         _id,
         {
            $set:{
               title,
               description,
               thumbnail: Thumbnail.url
            }
         },
         {
            new: "true"
         }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "video details uploaded successfully")
    )





})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
