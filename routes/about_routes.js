/* Functioner till About */

//Kallar express så att bygga appen 
const express = require('express');
// Vi kallar (aboutBlogger)
const aboutBlogger = require('./../models/about_models');

//--------------------------------------------------------------
//Router hänvisar till hur  applikations slutpunkter (URI) svarar på klientförfrågningar 
// till exempel app.get () för att hantera GET-förfrågningar och app.post för att hantera POST-förfrågningar
const router = express.Router();
//--------------------------------------------------------------

//visa formulär genom get() 
router.get('/new', (req, res) => {
  const error = ''
  res.render('about_views/new', { about_form: new aboutBlogger(), error:error });
});
//--------------------------------------------------------------

// skicka formulärdata per post ()
router.post('/', async (req, res, next) => {
  req.about_form = new aboutBlogger();
  next();
}, saveAboutInstanceAndRedirect('new'));
//--------------------------------------------------------------

// visar formulär med data(inlägg) för redigering
router.get('/edit/:id', async (req, res) => {
  const about_form = await aboutBlogger.findById(req.params.id);
  res.render('about_views/edit', { about_form: about_form });
});
//--------------------------------------------------------------

// Redigera befintlig inlägg med put()
router.put('/:id', async (req, res, next) => {
  req.about_form = await aboutBlogger.findById(req.params.id);
  next();
}, saveAboutInstanceAndRedirect('edit'));
//--------------------------------------------------------------

// Radera befintlig inlägg med put()
router.delete('/delete/:id', async (req, res) => {
  await aboutBlogger.findByIdAndDelete(req.params.id);
  res.redirect('/about');
});
//--------------------------------------------------------------

// Functionen som spararaboutBlogger 
// instance & redirect
function saveAboutInstanceAndRedirect(path) {
  return async (req, res) => {
    let about_form = req.about_form
    about_form.first_name = req.body.first_name
    about_form.last_name = req.body.last_name
    about_form.contact = req.body.contact
    about_form.github = req.body.github
    about_form.achievements = req.body.achievements
    try {
      about_form = await about_form.save();
      res.redirect(`/about`);
    } catch (e) {
      res.render(`about_views/${path}`, { about_form: about_form, error:errors });
    }
  }
};

// Exporterar alla functioner genom module
module.exports = router