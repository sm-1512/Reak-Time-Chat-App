import jwt from "jsonwebtoken"


export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, //milli-sec
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks. This token is not accessible by a javascript
        sameSite: "strict", //CSRF attacks cross-site request forgery attacks
        secure: process.env.Node_ENV !== "development"

    });
    return token;
}