import connectDB from '../../utils/connectDb';
import User from '../../models/User';
import Cart from '../../models/Cart';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

connectDB();

export default async (req, res) => {
    const { name, email, password } = req.body;

    try {

        if (!isLength(name, { min: 3, max: 20 })) {
            return res.status(422).send('Name must be between 3-20 characters long');
        }
        else if (!isLength(password, { min: 6 })) {
            return res.status(422).send('Password must be at least 6 characters long');
        }
        else if (!isEmail(email)) {
            return res.status(422).send('Invalid Email');
        }

        //Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(422).send('A user with that email already exists');
        }

        //Hash password and add to DB
        const hash = await bcrypt.hash(password, 10);
        const newUser = await new User({
            name,
            email,
            password: hash
        }).save();
        console.log(user);
        await new Cart({ user: newUser._id }).save();

        //Create token for user
        const token = jwt.sign({ userID: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        //Send back token
        res.status(201).json(token);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error signing up user. Please try again later');
    }
};