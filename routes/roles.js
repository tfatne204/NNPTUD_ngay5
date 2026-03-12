var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles')

// GET all roles
router.get('/', async function (req, res, next) {
    try {
        let data = await roleModel.find({});
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// GET role by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
        if (result) {
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

// GET all users with a specific role
router.get('/:id/users', async function (req, res, next) {
    try {
        let roleId = req.params.id;
        let userModel = require('../schemas/users');
        let data = await userModel.find({
            role: roleId,
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

// POST create role
router.post('/', async function (req, res, next) {
    try {
        let { name, description } = req.body;
        
        if (!name) {
            return res.status(400).send({
                message: "name is required"
            })
        }

        let newRole = new roleModel({
            name,
            description: description || ""
        });

        let result = await newRole.save();
        res.status(201).send({
            message: "Role created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// PUT update role
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { name, description } = req.body;

        let updateData = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        let result = await roleModel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (result) {
            res.send({
                message: "Role updated successfully",
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

// DELETE role (soft delete - not implemented for role, but can be added if needed)
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndDelete(id);
        
        if (result) {
            res.send({
                message: "Role deleted successfully",
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

module.exports = router;
