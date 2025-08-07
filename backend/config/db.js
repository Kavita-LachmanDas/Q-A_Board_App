import mongoose from "mongoose";

const DbConnection = async()=>{
return mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log('DB IS CONNECTED');
}).catch((err)=>{console.log('DB IS NOT CONNECTED' , err);
})
}

export default DbConnection