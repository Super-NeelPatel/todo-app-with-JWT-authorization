const User = require("../model/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Tasks = require("../model/taskModel")

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.getHome = async (req, res, next) => {
    const { id } = req.user
    try {

        const user = await User.findById(id)
        res.status(200).json({
            user
        })
    } catch (err) {
        res.status(400).json({
            err
        })
    }
}

exports.signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const newUser = await User.create({ name, email, password })
        const token = signToken(newUser.id)
        res.status(200).json({
            token
        })
    } catch (err) {
        res.status(400).json({
            message: "Fail",
            err
        })
    }
}


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            message: "Please provide email and password!"
        })
    }


    try {
        // 1. Find user by email
        const user = await User.findOne({ email }).select("+password")
        // console.log(user);

        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        // 2. Compare passwords
        const isMatch = await user.comparePassword(password)
        // console.log(isMatch);

        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // 3. Create JWT token
        const token = signToken(user.id)
        // 4. Send token back
        res.status(200).json({ token });


    } catch (err) {
        res.status(401).json({
            message: "Fail",
            err
        })
    }


}


// exports.getHome = async (req, res, next) => {
//     res.status(200).json({
//         message: req.user
//     })
// }

exports.createTask = async (req, res, next) => {
    const { id } = req.user
    const { title, description } = req.body
    if (!id) {
        return res.status(400).json({
            message: "fail. No UserID found!",
        })
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({
            message: "No user exist!",
        })
    }
    //ADDING TASK TO USER
    try {
        user.tasks.push({ title, description })
        await user.save()
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({
            message: "Faild to add task.",
            error: err.message
        })
    }
}
exports.getAllTasks = async (req, res, next) => {
    const { id } = req.user
    try {
        const user = await User.findById(id).select('tasks');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user.tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}

exports.deleteTask = async (req, res, next) => {
    const { taskId } = req.params;
    const { id } = req.user

    try {
        const user = await User.findById(id).select('tasks');
        if (!user) return res.status(404).json({ error: 'User not found' });
        // console.log(user);

        const task = user.tasks.id(taskId)
        if (!task) return res.status(404).json({ message: "Task not found" });
        // console.log(task);

        user.tasks.pull(task._id); // ✅ safer than .remove()
        await user.save();
        res.status(200).json({ message: "Task deleted successfully", tasks: user.tasks });

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task.' });
    }




}

exports.updateTask = async (req, res, next) => {
    const { id } = req.user
    const { taskId } = req.params
    const { title, description } = req.body
    try {
        const user = await User.findById(id).select("tasks")
        if (!user) return res.status(404).json({ error: 'User not found' });

        const task = user.tasks.id(taskId)
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.title = title;
        task.description = description;
        await user.save()

        res.status(201).json({
            user
        })
    } catch (err) {
        res.status(500).json({
            message: "error while updating task"
        })
    }
}