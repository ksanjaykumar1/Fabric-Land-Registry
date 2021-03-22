const express =require('express')
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult } = require('express-validator')
const config = require('config')
const auth = require('../../middleware/auth')

const User = require('../../models/User')


// @ route Get api/auth
// @desc   Test route
// @access Public
router.get('/',auth, async (req,res)=> {
    
    try {
        const user  = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
        console.error(err)
        res.status(500).send('server error')
    }
})


// @ route Get api/auth
// @desc   Authenticate user and get token
// @access Public
router.post('/',[
    check('email', 'Please include a valud emial').isEmail(),
    check('password', 'password is required').exists()

],async (req,res)=> {
    //console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email , password}= req.body
    try {
        // see if user exists by email , you can replace email with name etc
        let user = await User.findOne({email});
        if(!user){

            return res.status(400).json({errors : [{msg : 'invalid crednetials'}] });
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({ errors : [{msg : 'invalid crednetials'}] });
        }
    //  jsonwebtoken 

    const payload = {
        user :{
            id : user.id
        }
    }
    jwt.sign(payload,
        config.get('jwtSecret'),
        {expiresIn:360000},
        (err, token)=>{
            if(err) throw err;
            res.json({token});
        }
    )


       // res.send('User Registered')
    }
    catch(err){
        console.error(err.message)
        res.status(500).send('Server error')

    }
  


})


module.exports= router;