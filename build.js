var gulp = require("gulp")
var params = require("./params")
var swig = require("swig")
var fs = require("fs")
var _  = require("lodash")
var del = require("del")
var marked = require('marked')

function clean() {
  del.sync("chapters")
  del.sync("index.html")
}

var chaptersPath = "src/chapters"
var allPosts = []
var template = "src/templates"

function build() {
  makeChapters()
  buildIndex()
  buildChapters()
}

function  buildIndex() {
  var indexTpl = swig.compileFile(`${template}/index.html`);
  var indexParams = _.extend({allPosts}, params)
  var indexHTML = indexTpl(indexParams)
  fs.writeFileSync("./index.html", indexHTML)
}

function buildChapters() {
  var sectionTpl = swig.compileFile(`${template}/section.html`);
  fs.mkdirSync("chapters")
  allPosts.forEach(function(chapter) {
    var targetDir = chapter.path.replace("src/", "")
    fs.mkdirSync(targetDir)
    chapter.sections.forEach(function(section) {
      var rawContent = fs.readFileSync(`${chapter.path}/${section}`, "utf-8")
      var content = makeMarkdown(rawContent)
      var name = section.replace(".md", "")
      var title = (chapter.chapterIndex !== -1) 
        ? `${chapter.chapterIndex}.${name}`
        : `${chapter.chapterName}: ${name}`
      var sectionParams = _.extend({}, {content, sectionTitle: title}, params)
      var html = sectionTpl(sectionParams)
      fs.writeFileSync(`${targetDir}/${name}.html`, html)
    })
  })
}

function makeMarkdown(rawContent) {
  return marked(rawContent)
}

function makeChapters() {
  var chapters = fs.readdirSync(chaptersPath).sort()
  chapters.forEach(function(chapter) {
    var path = `${chaptersPath}/${chapter}`
    var sections = fs.readdirSync(path).sort()
    if ((+chapter[0]) || chapter[0] === "0") {
      var chapterIndex = +chapter[0]
      var chapterName = `第${chapterIndex}章` + chapter.substring(1)
    } else {
      var chapterIndex = -1;
      var chapterName = chapter
    }
    allPosts.push({chapter, sections, path, chapterIndex, chapterName})
  })
}

var fns = {clean, build}

var task = process.argv[2]
var fn = fns[task]

if (fn) {
  fn()
} else {
  throw new Error(`Task ${task} is not found`)
}
