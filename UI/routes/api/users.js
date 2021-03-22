const express =require('express')
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult } = require('express-validator')
const config = require('config')

const User = require('../../models/User')
// @ route Get api/users
// @desc   Register user
// @access Public
router.post('/',[

    check('name','Name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valud email').isEmail(),
    check('password', 'Please enter a password with 6or more characters').isLength({min :6})

],async (req,res)=> {
    //console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email , password}= req.body
    try {
        // see if user exists by email , you can replace email with name etc
        let user = await User.findOne({email});
        if(user){

            return res.status(400).json({errors : [{msg : 'user already exists'}]});
        }
          // get users gravatar
    const avatar = gravatar.url(email,{
        s: '200',
        r: 'pg',
        d: 'mm'
    })
    // create instance of user 

    user = new User({
        name, email, avatar, password
    })

    //encrypt passwaord using bcrypt

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password,salt)

    // this will give return promise 
    await user.save();


    // return jsonwebtoken 

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

module.exports = router;