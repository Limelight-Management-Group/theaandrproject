const express = require('express')
let app = express()
let ejs = require('ejs')
let bodyParser = require('body-parser')
const queries = require('./database/db.js')

// direct requests to the public directory
app.use( express.static( __dirname + '/public' ) );
//set default view engine
app.set( 'view engine', 'ejs' );

// set up template
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
  extended: false
} ) );


app.get('/', (req, res) =>{
  console.log('got the root route')
  res.render('users/index')
})


app.get('/signup', (req, res) => {
  console.log('checking in from mentee home!')
  res.render('signup');
})
app.post('/signup',(req, res) => {
  let user = req.body
  queries.create(user)
  console.log('this is the post user here-->', user)

  console.log(user,'<--user')
  // req.session.user = user.dataValues;
  res.render('login', {user});
})

// route for user Login
app.get('/login', (req, res) => {
    // console.log('this is the session Checker', sessionChecker)
        res.render(__dirname + '/views/login.ejs');
});
app.post('/login', (req, res) => {
      console.log('sent the post')
        var user = req.body
        // console.log('user', user)
       //  console.log('username', user.username)

       // console.log('this is the req.body: ', req.body)
       queries.getOneuser(user)
        .then(user => {
             // console.log('this si the user: ', user)
             console.log('the user.username',user.username)
             console.log('req.body.username', req.body.username)
             console.log('user.password', user.password)
             console.log('req.body.password', req.body.password)
              // console.log(mentee.menteename)
            if (( user.username === req.body.username && user.password === req.body.password)){
                // document.cookie = `username = ${user.username}`
                console.log("yo! You're logged-in!!!!")
                // console.log('this is the user object', {user})
                var image = user.image

                // if(req.files){
                //     // console.log('these is the req.files', req.files)
                // }
                // fs.writeFile('public/images/kanye-west-fan.jpg', image, 'binary', function(err){
                //     if (err) throw err
                    // console.log('user--->', user)
                    res.render('users/profile', {user});
                // })
          } else {
                console.log('I did not login!!!')
                // req.session.mentee = user.dataValues;
                res.redirect('/');
          }
            
        }).catch(console.log)
    });

let port = 3000
app.listen(port, () =>{
  console.log('phase server is live on port:', port)
})