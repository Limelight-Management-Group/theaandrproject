var cookieParser = require( 'cookie-parser' );
var session = require( 'express-session' );

const express = require('express')
let app = express()
let ejs = require('ejs');
// let S3FS = require('s3fs');
let fs = require('fs')
// let options = {
//   accessKeyId: 'AKIAINSX65WRUUDC6REA',
//   secretAccessKey: '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',
//   region: 'us-west-1'
// }
var AWS = require('aws-sdk');

var s3 = new AWS.S3();


let multiparty = require('connect-multiparty');
let multipartyMiddleware = multiparty();
// console.log('this is the multipartyMiddleware', multipartyMiddleware)
let bodyParser = require('body-parser')
const queries = require('./database/db.js')

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use( cookieParser() );

// direct requests to the public directory
app.use( express.static( __dirname + '/public' ) );
//set default view engine
app.set( 'view engine', 'ejs' );

app.use(multipartyMiddleware);
// let userIdArr = [];

// initialize express-session to allow us track the logged-in user across sessions.
app.use( session( {
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: true,
  saveUninitialized: true,
  cookie: {
    expires: 600000,
  }
  // cookie.messages =  AlluserMessages
} ) );
//This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
//checking for stale cookie
app.use((req, res, next) => {
    // console.log('req.cookies::', req.cookies)
    if (req.cookies.user_sid && req.session) {
        console.log('<-id check->')
        // console.log('<-',req.session)
        res.clearCookie('user_sid');

        next();        
    } else {
    console.log('id else condition')
    next();
    }
});
console.log('made it to the sessionChecker')
// middleware function to check for logged-in users
let userMessagesArray = []
var userObj = []
var userIdArr = [];
var sessionChecker = (req, res, next) => {
    if (req.cookies.user_sid) {
// console.log(req.cookies.user_sid, '<--userMessagesArray')
      let value = req.cookies.user_sid
      let newValue = req.cookies
      let userSessionInfo = []
      console.log('this is UserIdArray', userIdArr)
      let userMessages = userMessagesArray
      let userMessagesArray1 = []
      console.log(userObj,'<--->')
      req.cookies.currentUser =  userObj[0]
      var currentUser = req.cookies.currentUser
      console.log('currentUser', currentUser)
      let parsedMessages = userMessages
    
      // console.log(userMessagesArray1, '<------PARSEDMessages')
      // console.log('da req.cookies--->', req.cookies.user_sid)
      // queries.findUserAndAllUserPosts(req.cookies.user_sid)
      // .then((post)=>{
      //   console.log('DAPOST------>>>..>', post)
        
      // })
        res.render('users/profile', {userSessionInfo, value, userObj: userObj[0], userMessagesArray});

        next();
    } else {
      console.log('working, but failing')
      
    }    
};

// app.post('users/profile', (req, res) => {
//   console.log(user, '<------------<<<')
//     console.log('this is the logins req.body!!!!!! ', req.body)
//     queries.findUserAndAllUserPosts(users)
//     .then( user => {
//       console.log('THIS IS VALUE', value)
//     console.log('this is the value of userMessagesArray: ', userMessagesArray)
//     // console.log(user,'<---userOBJ')   
//     }).then(
//       queries.findAllPostByUser(req.cookies.user_sid)
//       .then((message)=>{
//         console.log('A MESSAGE:>>>>>>:', message)
//     res.render('profile', {message, user});
//       })
// )
// })

// set up template
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
  extended: false
} ) );




app.get('/', (req, res) =>{
  console.log('got the root route')

  // console.log(uuidV4(), 'the uuidV4')
  res.render('users/index')
})
let messagesArr = [];

app.get('users/profile', sessionChecker, (req, res) => {
    var user_id = req.session.cookie
    console.log(user, '<------------<<<')
    queries.findUserAndAllUserPostsById(user_sid)
    .then((messages => {
        console.log('---><------', messages)
        // console.log('this is the user_id', user_id)
        // console.log('this is the value of user: ', req.session)
        res.render('profile', { user: messages, userId: user_id});
        
    }) )
    console.log('these are the req.params: ', req.params)
    // console.log('this is the session user!!: ', req.session)
    // console.log('this is the cookie!!!!!! ', req.cookies.user_id)
})

app.get('/signup', (req, res) => {
  console.log('checking in from mentee home!')
  // console.log('this is the request ')
  res.render('signup');
})
let pictureArr = [];
app.post('/signup', sessionChecker, (req, res) => {
  let user = req.body
  let user_sid = req.cookies
  user.user_sid = user_sid.user_sid
  // console.log('DA USER', req.session.key)
  console.log('the user', user) 
  queries.create(user)
  console.log('this is the post user here-->', user.image)

  let userPic = user.image
  // console.log('//?//',userPic)
  pictureArr.push(userPic)
  // req.session.user = user.dataValues;
  res.render('users/profile', {user});
})

// route for user Login
app.get('/login', (req, res) => {
  queries.getAll()
  .then((users)=>{
    console.log('this us users', users)
    // console.log('this is the session Checker', userMessagesArray)
    // console.log(userIdArr)
        res.render(__dirname + '/views/login.ejs');
  })

});
app.post('/login', sessionChecker, (req, res) => {
        let user_sid = req.cookies.user_sid
        // console.log('the user_sid', user_sid) 
      // console.log('sent the post')
        var user = req.body
        userIdArr.push(user)
        // console.log('useriddaee', userIdArr)
        // console.log('user<<', user.username)
        // console.log('userOBJECTTTT', userObj)
        // user.user_sid = user_sid
         console.log('test', queries.findUserAndAllUserPosts(user.username))
       // debugger
       queries.findUserAndAllUserPosts(user.username)
        .then(userAndPosts => {
          console.log('GGGGGGGGGGGG_____GGGGGGG',userAndPosts)
        userObj.push(userAndPosts[0])
             // console.log('the userAndPosts', userAndPosts)
             // console.log('user_sid rightchere', user.user_sid)
             usersPost.push(userAndPosts[0].user_sid)
             // console.log('pushed id', usersPost)
              userAndPosts.forEach((message)=>{
                // console.log('you pushed me', message)
                  // userMessagesArray.push(message)
                  userMessagesArray.push(message)
              })
                    
              console.log('CHECKKK')
              console.log('I HAVE userAndPosts[0].user_sid', req.body.password)
              console.log('req.body.username')
            console.log('this is userIdArr', userIdArr)
            if (( userAndPosts[0].username === req.body.username && userAndPosts[0].password === req.body.password)){
              console.log('you are logged in', req.body)
              userAndPosts[0].user_sid = req.cookies.user_sid
              console.log('I HAVE userAndPosts[0].user_sid', userAndPosts[0].user_sid)

                var image = user.image
                    // userMessagagesArray[0].forEach((message)=>{
                    //   console.log('this is the message', message)  
                    // })
                    for(let i = 0; i < userMessagesArray.length; i++){
                      // console.log('user--->>', userMessagesArray[i])  
                    }
                    var messageOnPage = userMessagesArray[0]
                    // console.log('MESSAGE ON PAGE:', messageOnPage)
                    req.session.user = userAndPosts[0]
                    // console.log('SANITY CHECKKK------------------------->', req)
                    let user_sid = req.session.user.user_sid

                    // console.log('this is the user_sid from session--->', user_sid)
                    let userObject = req.session.user
                    let userAndPosts = user.user_sid.user_sid.user_sid
                    // console.log(userObject, '<--------------userObject')
                    sessionSid = {user}
                    // console.log('<---->', sessionSid) 
                    userIdArr.push(userObject)
                    let userId = user_sid
                    // console.log('useIdArr--->>',userIdArr[0])
                    sessionSid = {user}
                    // console.log(user, '<---------------user')
                    let user = userObj
                    console.log(ureq.body.user_uid, 'FINAL USER OBJECT')
                    res.redirect('users/profile', {user_sid, userObj: user.user_sid, userObject, userMessagesArray: userMessagesArray});
                // })
          } else {
                console.log('I did not login!!!')
                // req.session.mentee = user.dataValues;
                res.redirect('/');
          }
            
        })
    });
let usersPost = []
app.post('/user_profile_post', (req, res) =>{

  // console.log('userIdArr1', userIdArr1)
  let user = req.cookies.user_sid
  console.log('this is the user<><><>', user)
  queries.findUserById('s:kKk5h3G-KbzN_M2Zh8htyJk8U_W_Zfpo.vVuqruK/UaQ4MIENFLtxbJC7soiENiOpxENaNU/9Q4s')
  .then((userInfo)=>{
    console.log('I have the userInfo', userInfo)
  })
  let usersPost = req.body.user_post
  // console.log('----->the user', session.cookies.currentUser)
  // console.log('the user_profile_post', req)
  let post = {}
  let allUserMessages = {}
  post.message = req.body.message
  messagesArr.push(post.message)
  console.log('the messagesArr', messagesArr)
  messagesArr.forEach((message)=>{
    let user = userIdArr[0]
    console.log('this is the message', message)
    // user.messages += message + '<br>'
    // allUserMessages.messages = user.messages
  })
  console.log('this is the cookies', req.cookies.user_sid)
  post.sender = req.cookies.user_sid
  console.log('this is the username in post', userMessagesArray)
    console.log(messagesArr.length)
  // console.log('the post.sender', usersPost[0])
  console.log('----The post object->', post)
  // console.log('just making sure!<<<<<>>>><<>><>:', post)
  queries.creatNewPost(post)
  .then(post =>{
    console.log('this is POST---->>>>>>>>>>>>>>>>>', post )
  })
  res.render('users/profile', {user, userObj: userObj, userMessagesArray: userMessagesArray})
})

let port = 3001
app.listen(port, () =>{
  console.log('phase server is live on port:', port)
})