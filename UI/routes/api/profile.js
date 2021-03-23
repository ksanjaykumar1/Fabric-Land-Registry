const express =require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const {check, validationResult}= require('express-validator')

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private

router.get('/me', auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.user.id
      }).populate('user', ['name', 'avatar']);
  
      if (!profile) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
      }
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  })

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

router.post('/', [auth , [
    // check('status',"Status is required").not().isEmpty(),
    // check("skills","skills is required").not().isEmpty()

] ], async (req,res) =>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
    // destructure the request
    const {
       city,
       status,
       bio,
       phoneNumber,
       email,
       address,
       fabricUsername,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;

      // build profile object 
      const profileFields ={}
      profileFields.user= req.user.id;
      if(city) profileFields.city=city;
      if(status) profileFields.status=status;
      if(bio) profileFields.bio=bio;
      if(phoneNumber) profileFields.phoneNumber=phoneNumber;
      if(address) profileFields.address=address;
      if(email)profileFields.email= email;
      if(fabricUsername){
        profileFields.fabricUsername= fabricUsername;
        profileFields.fabricAccount=true;
      }
    //   if(skills) {
    //       profileFields.skills = skills.split(',').map(skill => skill.trim());

    //   }
    // //   console.log(profileFields.skills)
    
      


    //   // Build social object
    //  profileFields.social = {};
    //  if(email) profileFields.social.email=email;
    //  if(linkedin) profileFields.social.linkedin=linkedin;


    try {

        profile = await Profile.findOne({user:req.user.id})

        if(profile) {

            //update
             profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
              );

              return res.json(profile)


        }

        //create
        profile = new Profile(profileFields)
        await profile.save();
        return res.json(profile);  
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        
    }

})

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // @route    GET api/profile/user/:user_id
  // @desc     Get profile by user ID
  // @access   Public
router.get(
    '/user/:user_id',
    async (req , res) => {
      try {
        const profile = await Profile.findOne({
          user: req.params.user_id
        }).populate('user', ['name', 'avatar']);
  
        if (!profile) return res.status(400).json({ msg: 'Profile not found' });
  
        return res.json(profile);
      } catch (err) {

        console.error(err.message);
        if(err.kind == 'ObjectID'){
            return res.status(400).json({ msg: 'Profile not found' });

        }
        return res.status(500).json({ msg: 'Server error' });
      }
    }
  );

// @route    Delete api/profile
// @desc     delete profile, user and posts
// @access   private
router.delete('/', auth, async (req, res) => {
    try {
        // todo remove ysers posts
    // remove profile
      await Profile.findOneAndRemove({user : req.user.id});
      // remove user
      await User.findOneAndRemove({_id : req.user.id});
      res.json({msg:"user deleted"});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


// @route    Put api/profile/experience
// @desc    add profile experience
// @access   private
router.put('/experience',[auth, [
    check("title",'tittle is required').not().isEmpty(),
    check("company",'company is required').not().isEmpty(),
    check("from",'from date is required').not().isEmpty()
    ]
], async (req, res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }


    const {
        title,
        company, 
        location,
        from,
        to,
        current,
        description
    }= req.body;

    const newExp = {
        title,
        company, 
        location,
        from,
        to,
        current,
        description
    }

    try {

        const profile = await Profile.findOne({user: req.user.id});
        //adding experience on top 
        profile.experience.unshift(newExp);

        await profile.save();
        res.json(profile)
        
    } catch (err) {

        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
        
    }

    }

)

// @route    Delete api/profile/experience/:exp_id
// @desc    delete experience from profile
// @access   private

router.delete('/experience/:exp_id',auth, async (req,res)=>{

    try {
        const profile = await Profile.findOne({user: req.user.id});

        //get remove index
        const removeIndex = profile.experience.map(item =>item._id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex,1)
        await profile.save();
        res.json(profile)
        
    } catch (err) {

        console.error(err.message);
        return res.status(500).json({ msg: 'Server error' });
        
        
    }
})

module.exports = router;


