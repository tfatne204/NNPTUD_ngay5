var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users')

// GET all users
router.get('/', async function (req, res, next) {
    try {
        let data = await userModel.find({
            isDeleted: false
        }).populate({
            path: 'role',
            select: 'name description'
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// GET user by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findById(id).populate({
            path: 'role',
            select: 'name description'
        });
        if (result && !result.isDeleted) {
            res.send(result);
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
});

// POST create user
router.post('/', async function (req, res, next) {
    try {
        let { username, password, email, fullName, avatarUrl, role } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).send({
                message: "username, password, and email are required"
            })
        }

        let newUser = new userModel({
            username,
            password,
            email,
            fullName: fullName || "",
            avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
            role: role || null,
            status: false,
            loginCount: 0
        });

        let result = await newUser.save();
        let populatedResult = await result.populate({
            path: 'role',
            select: 'name description'
        });
        
        res.status(201).send({
            message: "User created successfully",
            data: populatedResult
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// PUT update user
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { username, password, email, fullName, avatarUrl, role, loginCount } = req.body;

        let updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.password = password;
        if (email) updateData.email = email;
        if (fullName !== undefined) updateData.fullName = fullName;
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
        if (role !== undefined) updateData.role = role;
        if (loginCount !== undefined) updateData.loginCount = loginCount;

        let result = await userModel.findByIdAndUpdate(id, updateData, { new: true }).populate({
            path: 'role',
            select: 'name description'
        });
        
        if (result && !result.isDeleted) {
            res.send({
                message: "User updated successfully",
                data: result
            });
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// DELETE user (soft delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        
        if (result) {
            res.send({
                message: "User deleted successfully",
                data: result
            });
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// POST enable user (set status to true)
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).send({
                message: "email and username are required"
            })
        }

        let result = await userModel.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        ).populate({
            path: 'role',
            select: 'name description'
        });

        if (result) {
            res.send({
                message: "User enabled successfully",
                data: result
            });
        } else {
            res.status(404).send({
                message: "User not found with the provided email and username"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// POST disable user (set status to false)
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).send({
                message: "email and username are required"
            })
        }

        let result = await userModel.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        ).populate({
            path: 'role',
            select: 'name description'
        });

        if (result) {
            res.send({
                message: "User disabled successfully",
                data: result
            });
        } else {
            res.status(404).send({
                message: "User not found with the provided email and username"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

module.exports = router;
