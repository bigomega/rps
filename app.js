const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy
const DB = require('./models/mongoHelper')

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
passport.use(new TwitterStrategy({
    consumerKey: '4DpVR4PHbyJmFJOUnCfvg',
    consumerSecret: 'Qnp2COBxtvdNG6UO8udUOQGkd6M95AprMvP8om60CA',
    callbackURL: 'http://localhost:3000/auth/twitter/callback',
  },
  function(token, tokenSecret, profile, done) {
    DB.User.findOrCreate('twitter', {
        id: profile.username,
        displayName: profile.displayName,
        imageUrl: profile.photos[0].value,
      })
      .then(user => { done(null, user) })
      .catch(err => done(err))
    ;
  }
))

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', 1)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'jaraxxes',
  store: new MongoStore({ dbPromise: DB.Helper._getDb() })
}))
app.use(passport.initialize())
app.use(passport.session())

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
  // or res.sendStatus(401)
}

app.get('/auth/twitter', passport.authenticate('twitter'))

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' })
  // function(req, res) {
  //   if (req.user.handle) {
  //     res.redirect('/')
  //   } else {
  //     res.redirect('/profile?edit=true')
  //   }
  // }
)

app.get('/', function(req, res){
  DB.Blog.query({}).then(blogs => {
    res.render('index', {
      user: req.user,
      blogs: blogs.map(b => ({ title: b.title, id: b._id }))
    })
  })
})

app.get('/new-story', ensureAuthenticated, function(req, res){
  res.render('new_story', { user: req.user })
})

// app.get('/profile', ensureAuthenticated, function(req, res){
//   res.render('profile', { user: req.user, edit: req.query.edit })
// })

app.get('/login', function(req, res){
  res.render('login', { user: req.user })
})

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

app.get('*', function(req, res){
  res.render('404')
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', { err })
})

module.exports = app
