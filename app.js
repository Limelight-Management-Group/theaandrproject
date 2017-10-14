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

// // Bucket names must be unique across all S3 users

// var myBucket = 'limelight-user-media-2';

// var myKey = 'Yax4oy6CI+TUjjfneaR5MAN3paUEqtBVE5U5rPZZ';
// console.log( ' I made it to AWS!!!!!--->')
// s3.createBucket({Bucket: myBucket}, function(err, data) {

// if (err) {

//    console.log(err);

//    } else {
//     console.log(' I am here!!!')
//      params = {Bucket: myBucket, Key: myKey, Body: pictureArr[0]};

//      s3.putObject(params, function(err, data) {

//          if (err) {

//              console.log(err)

//          } else {

//              console.log("Successfully uploaded data to myBucket/myKey");

//          }

//       });

//    }

// });
// // Generate a v1 UUID (time-based)
// const uuidV1 = require('uuid/v1');
// uuidV1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
// // console.log('the uuidV1', uuidV1)

// // Generate a v4 UUID (random)
// const uuidV4 = require('uuid/v4');
// uuidV4(); // -> '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
// // console.log('the uuidV4', uuidV4)
// // let s3fsImplementation = new S3FS('limelight-user-media1', options);
// // s3fsImplementation.create()
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
let userIdArr = [];

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
var sessionChecker = (req, res, next) => {
    if (req.cookies.user_sid) {
// console.log(userMessagesArray, '<--userMessagesArray')
      let value = req.cookies.user_sid
      let newValue = req.cookies
      let userSessionInfo = []
      let userMessages = userMessagesArray
      let userMessagesArray1 = []

      // console.log('newValue', newValue)
      let parsedMessages = userMessages
      console.log(userMessagesArray1, '<------PARSEDMessages')
        // console.log('this is the sessionChecker')
        res.render('users/profile', {userSessionInfo, value, userMessagesArray});

        next();
    } else {
      console.log('working, but failing')
      
    }    
};

app.post('/profile', sessionChecker, (req, res) => {
    // console.log('this is the logins req.body!!!!!! ', req.body)
    queries.getOneuser(req.body)
    .then( user => {
      console.log('THIS IS VALUE', value)
    console.log('this is the value of userMessagesArray: ', userMessagesArray)
    // console.log(user,'<---userOBJ')   
    }).then(
      queries.findAllPostByUser(req.cookies.user_sid)
      .then((message)=>{
        console.log('A MESSAGE:>>>>>>:', message)
    res.render('profile', {message, user});
      })
)
})
app.get('/profile', sessionChecker, (req, res) => {
    var user_id = req.session.cookie
    console.log(user, '<------------<<<')
    queries.findAllPostByUser(user_id)
    .then((messages => {
        console.log('---><------', user_sid)
        // console.log('this is the user_id', user_id)
        // console.log('this is the value of user: ', req.session)
        res.render('profile', {userId: user_id});
        
    }) )
    console.log('these are the req.params: ', req.params)
    // console.log('this is the session user!!: ', req.session)
    // console.log('this is the cookie!!!!!! ', req.cookies.user_id)
})

// set up template
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
  extended: false
} ) );



// app.post('/testupload', (req, res) =>{
//   console.log('working in here...')
//   let file = req.files
//   console.log('this is the file -->', file)
//   let stream = fs.createReadStream(file.path)
//   return s3fsImplementation.writeFile(file.originalFilename, stream).then(function(){
//     fs.unlink(file.path, function(err){
//       if(err)
//         console.err(err)
//     })
//     res.redirect('/profile');
//   })
// })

app.get('/', (req, res) =>{
  console.log('got the root route')
  // console.log(uuidV4(), 'the uuidV4')
  res.render('users/index')
})

let messagesArr = [];
app.post('/user_profile_post', (req, res) =>{
  console.log('the USER', req.cookies.user_sid)
  let user = userIdArr[0].user_sid
  let usersPost = req.body.user_post
  // console.log('----->the user', user)
  // console.log('the user_profile_post', req)
  let post = {}
  let allUserMessages = {}
  post.message = req.body.message
  messagesArr.push(post.message)
  console.log('the messagesArr', messagesArr)
  messagesArr.forEach((message)=>{
    let user = userIdArr[0]
    console.log('this is the message', message)
    user.messages += message + '<br>'
    console.log('these are the messages', user.messages) 
    allUserMessages.messages = user.messages
  })
  console.log('---->>>>>>>>--->>', allUserMessages.messages)
  console.log('this is the users messages', userIdArr[0].messages)
  post.sender = user
    console.log(messagesArr.length)
  // console.log('the post.sender', req)
  console.log('----The post object', post)
  // console.log('just making sure!<<<<<>>>><<>><>:', )
  queries.creatNewPost(post)
  .then(post =>{
    console.log('this is POST---->>>>>>>>>>>>>>>>>', userIdArr[0].user.user_sid )
  })
  res.render('users/profile', {user, allUserMessages})
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
  console.log('DA USER', req.session.key)
  console.log('the user_sid', req.cookies) 
  queries.create(user)
  // console.log('this is the post user here-->', user.image)

  let userPic = user.image
  console.log(userPic)
  pictureArr.push(userPic)
  // req.session.user = user.dataValues;
  res.render('login', {user});
})

// route for user Login
app.get('/login', (req, res) => {
  queries.getAll()
  .then((users)=>{

    console.log('this is the session Checker', userMessagesArray)
    // console.log(userIdArr)
        res.render(__dirname + '/views/login.ejs');
  })

});
app.post('/login', sessionChecker, (req, res) => {
        let user_sid = req.cookies.user_sid
        console.log('the user_sid', user_sid) 
      // console.log('sent the post')
        var user = req.body
        console.log('user', user)
       //  console.log('username', user.username)
       // console.log('this is the req.body: ', req.body)
       console.log('this is the user_sidb4', user_sid)
       queries.findUserAndAllUserPosts(user)
        .then(userAndPosts => {
             // console.log('the userAndPosts', userAndPosts)
             console.log('user_sid', user_sid)
             // console.log('req.body.username', req.body.username)
             // console.log('user.password', user.password)
             // console.log('req.body.password', req.body.password)
              console.log('userMessagages---->>>>>', userAndPosts[0])
              userAndPosts.forEach((message)=>{
                console.log('you pushed me', message)
                  // userMessagesArray.push(message)
                  userMessagesArray1.push(message)
              })
            if (( user.username === req.body.username && user.password === req.body.password)){
            let AllOfUserPosts = []
             // console.log(userMessagesArray, '<---AllOfUserPosts')
                // document.cookie = `username = ${user.username}`
                // console.log("yo! You're logged-in!!!!")
                // console.log('this is the user object', {user})
                var image = user.image

                    console.log('user--->', userMessagesArray)
                    req.session.user = user
                    let user_sid = req.session.user.user_sid
                    // console.log('this is the user_sid from session--->', user_sid)
                    let userObject = req.session.user
                    let userAndPosts = user.user_sid.user_sid.user_sid
                    // console.log(userObject, '<--------------userObject')
                    sessionSid = {user}
                    // console.log('<---->', sessionSid) 
                    userIdArr.push(userObject)
                    // console.log('useIdArr--->>',userIdArr[0])
                    sessionSid = {user}
                    // console.log(user, '<---------------user')
                    console.log(userAndPosts, 'userAndPosts')
                    res.redirect('users/profile', {user_sid, user, userObject, userMessagesArray: userMessagesArray});
                // })
          } else {
                console.log('I did not login!!!')
                // req.session.mentee = user.dataValues;
                res.redirect('/');
          }
            
        })
    });

let port = 3000
app.listen(port, () =>{
  console.log('phase server is live on port:', port)
})