import User from "../models/user.js";
import bcrypt from 'bcrypt';

export async function getUsers(req, res) {
      try {
          const users = await User.find();
          res.status(200).json(users);
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: error.message });
        }
  }
  
export async function getUser(req,res) {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
}

export async function addUser(req, res) {
  const { firstName, lastName, userName, email, password, userStatus, userRole } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: hashedPassword,
    userRole: userRole,
    userStatus:userStatus
  });
  try {
    const savedUser = await user.save();
    const userId = savedUser._id.toString();
    res.status(200).json(userId);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(409).json("No User with this ID");
      res.status(200).json(`User deleted!`);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message})
  }
}
export async function updateUser(req, res) {
    const { firstName, lastName, userName, email, password, userStatus, userRole } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        await User.findByIdAndUpdate(req.params.id, {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: hashedPassword,
            userRole: userRole,
            userStatus: userStatus
        });
        res.status(200).json(`User with username ${userName} updated!`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    } 
}