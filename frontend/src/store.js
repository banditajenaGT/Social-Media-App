import { configureStore } from "@reduxjs/toolkit"
import { allUsersReducer, myPostsReducer, postOfFollowingReducer, userReducer } from "./Reducers/User"
import { likeReducer, getUserProfileReducer, userPostsReducer } from "./Reducers/Post"


const store = configureStore({
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducer,
        allUsers: allUsersReducer,
        like: likeReducer, 
        myPosts: myPostsReducer,
        userProfile: getUserProfileReducer,
        userPosts: userPostsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export default store