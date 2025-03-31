// This protect route middleware will be used in a bunch of places wherever we need to authenticate the user.


import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
    //The concept of next() comes in here because of this router.put("/update-profile", protectRoute, updateProfile); What we are going to do is first we are going to validate the token using the protectRoute which is a middleware, and then the next function will be called which in our case in the example above is updateProfile. This means that we are first authenticating the user and only then we are allowing the user to do any further task like updating profile or sending messages.

    try {
        const token = req.cookies.jwt; //We are calling .jwt because thats what we defined our token as in the util.js. Had it been res.cookie("x",...) we would have called req.cookie.x

        if(!token) {
            return res.status(401).json({message:"Unauthorised- No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({message: "Unauthorised: Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password"); //Select everything except the password

        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute Middleware", error.message);
        return res.status(500).json({message:"Internal Error"});
    }
}