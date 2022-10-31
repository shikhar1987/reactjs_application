const jwt = require("jsonwebtoken");
const authorize = (req, res, next) => {
    const authorization = req.headers.authorization;
    let token = null;
    if (authorization && authorization.split(" ").length == 2) {
        token = authorization.split(" ")[1];
        console.log("Token: ", token);
    } else {
        res.status(403).json({ error: true, message: "Authorization header not found" });
        return;
    }
    const secretKey = process.env.SECRET_KEY;
    try {
        const decoded = jwt.verify(token, secretKey);

        if (decoded.exp < Date.now()) {
            console.log("Token has expired");
            return;
        }
        next();
    } catch (e) {
        res.status(403).json({ error: true, message: "invalid token" });
    }
};
module.exports = authorize;