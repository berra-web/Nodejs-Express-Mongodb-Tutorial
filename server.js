// skapa Server genom att hämta ==>> 
const express = require('express');
const mongoose = require('mongoose');
const blogArticle = require('./models/blog_models');
const aboutBlogger = require('./models/about_models');
const blogArticleRouter = require('./routes/blog_routes');
const aboutRouter = require('./routes/about_routes');
const methodOverride = require('method-override');
const app = express();

//-------------------------------------------------------------------
// Hämtar api från MongoDB
mongoose.connect(
    'mongodb+srv://blog_user:Killinggnomes50@cluster0.wg4fx.mongodb.net/Cluster0?retryWrites=true&w=majority'
    , { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
    () => {
        console.log('DB is awesome');
    });

//-------------------------------------------------------------------
// Sätter EJS och view engine istället html för visning
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

//-------------------------------------------------------------------
// Skapar index Routes för hem sida dvs allt Som kommer efter '/' kommer visas på sidan 
app.get('/', async (req, res) => {   
  const articles = await blogArticle.find().sort({ 
  published: 'desc' 
});
  const total_post = articles.length
  return res.render('articles/index', { articles: articles, total_post: total_post });   
});

//-------------------------------------------------------------------
// Vi gör samma till About Sida 
app.get('/about', async (req, res) => {
  const about_author = await aboutBlogger.find().sort({ date_time_track: 'desc' });
  return res.render('about_views/about', { about_author: about_author });
});

//-------------------------------------------------------------------
// för att länka css / andra statiska tillgångar 
app.use(express.static(__dirname + '/public'));
app.use('/articles', blogArticleRouter);
app.use('/about', aboutRouter);


// localhost 
app.listen(5000);
