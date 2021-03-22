const express =require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const {check, validationResult}= require('express-validator');
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const http = require('http')
const util = require('util');

const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const constants = require('./config/constants.json')


const helper = require('./app/helper')
const invoke = require('./app/invoke')
const qscc = require('./app/qscc')
const query = require('./app/query')

// 
// @ route Post api/fabric/users
// @desc   Register and enroll user in fabric
// @access Public

router.post('/users',[
    check('username','username is required')
    .not()
    .isEmpty(),
    check('orgName','orgName is required')
    .not()
    .isEmpty(),
],async (req,res)=>{
    console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //destructuring the data
    const {username, orgName }= req.body
    

    let response = await helper.getRegisteredUser(username, orgName, true);
    logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, orgName);

        res.json({success:true, username:username,orgName:orgName});
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }
        
    
})

// @ route post api/fabric/users
// @desc   login user in fabric
// @access Public

router.post('/login',[
    check('username','username is required')
    .not()
    .isEmpty(),
    check('orgName','orgName is required')
    .not()
    .isEmpty(),
],async (req,res)=>{
    console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //destructuring the data
    const {username, orgName }= req.body
    

    let isUserRegistered = await helper.isUserRegistered(username, orgName);

    if (isUserRegistered) {
        res.json({ success: true, username:username,orgName:orgName });

    } else {
        res.json({ success: false, message: `User with username ${username} is not registered with ${orgName}, Please register first.` });
    }
        
    
})

// @ route post api/fabric/channels/:channelName/chaincodes/:chaincodeName
// @desc   Invoke transaction on chaincode on target peers
// @access Public

router.post('/channels/:channelName/chaincodes/:chaincodeName',
[[
    check('fcn','fcn is required')
    .not()
    .isEmpty(),
   

]]
,async (req,res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {peers,chaincodeName,channelName,fcn,args,transient ,username,orgName}= req.body
    try {
        let message = await invoke.invokeTransaction(channelName, chaincodeName, fcn, args, username, orgName, transient);
        console.log(`message result is : ${message}`)

        const response_payload = {
            result: message,
        }
        res.send(response_payload);
    } catch (err) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
        
    }
})

// @ route get api/fabric/channels/:channelName/chaincodes/:chaincodeName
// @desc   query transaction  with chaincode name
// @access Public

            
router.get('/channels/:channelName/chaincodes/:chaincodeName', async (req,res)=>{
    try {
        const {fcn}= req.query
        const args=req.query.args;
        const {channelName,chaincodeName}=req.params
        
        let message = await query.query(channelName, chaincodeName, args, fcn, "chiti", "Org1");
        

        const response_payload = {
            result: message,
    
        }

        res.send(response_payload);
    } catch (err) {

        console.error(err.message)
        res.status(500).send('Server Error')
        
    }
})

// @ route get api/fabric//qscc/channels/:channelName/chaincodes/:chaincodeName
// @desc   query transaction  details with chaincode name
// @access Public

            
router.get('/qscc/channels/:channelName/chaincodes/:chaincodeName', async (req,res)=>{
    try {
        const {fcn,args}= req.query
        const {channelName,chaincodeName}=req.params
        let response_payload = await qscc.qscc(channelName, chaincodeName, args, fcn, username, orgname);

        // const response_payload = {
        //     result: message,
        //     error: null,
        //     errorData: null
        // }

        res.send(response_payload);
    } catch (error) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
})





module.exports = router;