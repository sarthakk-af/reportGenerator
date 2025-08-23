const Rg = require('../models/rgSchema')

exports.createRg = async (req, res) => {
    try {
        let rg = new Rg(req.body)
        await rg.save()
        res.json({
            success: true
        })
    } catch (error) {
        res.json({
            success: false,
            error: error
        })
    }
}

exports.getAllRg = async (req, res) => {
    try {
        const rgs = await Rg.find()
        res.json({
            success: true,
            data: rgs
        })

    } catch (error) {
        console.log("Error",error)
        res.json({
            success: false,
            error: error
        })
    }
}

exports.getRgById = async (req, res) => {
    try {
        const rg = await Rg.findById(req.params.id)
        res.json({
            success: true,
            data: rg
        })
    } catch (error) {
        res.json({
            success: false,
            error: error
        })
    }
}

exports.deleteRgById = async (req, res) => {
    try {
        const rg = await Rg.findByIdAndDelete(req.params.id)
        res.json({
            success: true,
            data: rg
        })
    } catch (error) {
        res.json({
            success: false,
            error: error
        })
    }
}

exports.updateRgById = async (req, res) => {
    try {
        const rg = await Rg.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json({
            success: true,
            data: rg
        })
    } catch (error) {
        res.json({
            success: false,
            error: error
        })
    }
}