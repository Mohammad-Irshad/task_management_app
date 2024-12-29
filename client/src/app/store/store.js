import {configureStore} from "@reduxjs/toolkit"
import  userSlice  from "../features/userSlice"
import  taskSlice from "../features/taskSlice"

const store = configureStore({
    reducer : {
        user : userSlice,
        tasks : taskSlice
    }
})

export default store
