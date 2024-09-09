const express = require('express')
const {createRg,getAllRg,getRgById,deleteRgById,updateRgById} = require('../controllers/rgControllers')

const router = express.Router()

router.post('/createRg',createRg)
router.get('/getAllRg',getAllRg)
router.get('/getRgById/:id',getRgById)
router.delete('/deleteRgById/:id',deleteRgById)
router.patch('/updateRgById/:id',updateRgById)

module.exports = router;