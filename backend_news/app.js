const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const connecttoDb = require('./connectionDb.js');
const newsRouter = require('./router.js');
const { initSocket } = require('./utils/socket.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('express-session');
const User = require('./models/userModel.js');
const bodyParser = require('body-parser');
const bookmarkroutes = require('./bookmarkrouter.js');
const MongoStore = require('connect-mongo');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = initSocket(server);

app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
connecttoDb();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
       // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      //  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Handle cross-site cookies in production
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `https://news-app-4h7w.onrender.com/auth/google/callback`, // Dynamic callback URL
        scope: ['profile', 'email'],
    },
    async (token, tokenSecret, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id }).exec();
            if (user) {
                return done(null, user);
            } else {
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                });
                await newUser.save();
                return done(null, newUser);
            }
        } catch (err) {
            return done(err);
        }
    }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: 'https://news-app-4h7w.onrender.com',
    failureRedirect: 'https://news-app-4h7w.onrender.com'
}), (req, res) => {
    console.log('Authentication successful, user:', req.user);
    res.redirect('https://news-app-4h7w.onrender.com');
});

app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout error', error: err });
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

app.get('/auth/user', (req, res) => {
    console.log('Auth user endpoint called. User:', req.user);
    if (req.user) {
        res.status(200).json({ message: "user Login", user: req.user })
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
});

app.use('', bookmarkroutes);
app.use('/api', newsRouter);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//----------------------------------------------------DEPLOYMENT------------------------------------------//
const __dirname1= path.resolve();
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    });
}else{
    app.get("",(req,res)=>{
        res.send("API is running successfully");
    });
}

////----------------------------------------------------DEPLOYMENT------------------------------------------//

