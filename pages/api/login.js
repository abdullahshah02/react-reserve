import connectDB from '../../utils/connectDb'
import User from '../../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

connectDB();

export default async (req, res) => {
    console.log("in login")
    const { email, password } = req.body;
    try {
        //Check if user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(422).send("Invalid email or password");
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
            //Create token for user
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

            //Send back token
            res.status(201).json(token)
        }
        else {
            return res.status(422).send("Invalid email or password");
        }

    }
    catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
}