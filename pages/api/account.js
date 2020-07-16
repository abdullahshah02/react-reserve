import User from '../../models/User'
import jwt from 'jsonwebtoken'
import connectDB from '../../utils/connectDb';

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res);
            break;
        case "PUT":
            await handlePutRequest(req, res);
            break;
        default:
            res.status(403).send("Forbidden Method");
            break;
    }
}

async function handleGetRequest(req, res) {

    if (!req.headers.authorization) {
        return res.staus(401).send("No authorization token");
    }

    try {
        const { userID } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: userID })
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status.send("User not found");
        }
    }
    catch (error) {
        res.status(403).send("Invalid token");
    }
}

async function handlePutRequest(req, res) {
    const { _id, role } = req.body;
    await User.findOneAndUpdate(
        { _id },
        { role }
    )
    res.status(203).send("User role updated")
}