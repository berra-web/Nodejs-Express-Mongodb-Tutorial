//Model 
//Kallar mongoose 
const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const DomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = DomPurify(new JSDOM().window);

//Genom Mongoose.Schema vi skapar (title,description,published,body,status,slug,sanitizedHtml) som finns i blog articles 
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  published: {
    type: Date,
    default: Date.now
  },
  body: {
    type: String,
    required: true
  },
  status: [{type: String, required: true, multi: true, enum:
    ['Politics', 'Economics', 'Sport', 'Food', 'Art', 'Cars', 'Travel'], default: 'Politics', }],
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
});
 
// Vi kör den här logiken innan man sparar en modell exempel
blogSchema.pre('validate', function(next) {
  if (this.title) {
    //strict: true, tillåter slugify att ta bort några konstiga tecken från snigeln
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.body) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.body));
  }

  next();
});

//Exportera funktion för att skapa "BlogModel" modellklass
module.exports = mongoose.model('BlogModel', blogSchema, "MainCollection");
