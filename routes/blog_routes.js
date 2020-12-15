/* Functioner till blog sida */

//Kallar express så att bygga appen 
const express = require('express');
// Vi kallar (blogArticle)
const blogArticle = require('./../models/blog_models');

//------------------------------------------------------
//Router hänvisar till hur  applikations slutpunkter (URI) svarar på klientförfrågningar 
// till exempel app.get () för att hantera GET-förfrågningar och app.post för att hantera POST-förfrågningar
const router = express.Router();
//------------------------------------------------------

//visa formulär genom get() 
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new blogArticle() });  
});
//------------------------------------------------------

// skicka formulärdata per post ()
router.post('/', async (req, res, next) => { 
  req.article = new blogArticle();
  next();
}, saveInstanceAndRedirect('new'));
//------------------------------------------------------

// visar formulär med data(inlägg) för redigering
router.get('/edit/:id', async (req, res) => {      
  const article = await blogArticle.findById(req.params.id);
  res.render('articles/edit', { article: article });  
});
//------------------------------------------------------

//Sida för ett specifikt inlägg baserat på  /:slug
router.get('/:slug', async (req, res) => {
  const article = await blogArticle.findOne({ slug: req.params.slug });
  if (article == null) return res.redirect('/')
  res.render('articles/show', { article: article });   
});
//------------------------------------------------------

// Redigera befintlig inlägg med put()
router.put('/:id', async (req, res, next) => {
  req.article = await blogArticle.findById(req.params.id);
  next();
}, saveInstanceAndRedirect('edit'));
//------------------------------------------------------

// Radera befintlig inlägg med put()
router.delete('/:id', async (req, res) => {   
  await blogArticle.findByIdAndDelete(req.params.id);
  res.redirect('/');  
});
//------------------------------------------------------

// Functionen som sparar blogArticle 
// instance & redirect
function saveInstanceAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.body = req.body.body
    article.status = req.body.status
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });   
    }
  }
};

// Exporterar alla functioner genom module
module.exports = router