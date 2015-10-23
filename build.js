var gulp = require("gulp")
var params = require("./params")
var swig = require("swig")
var fs = require("fs")
var _  = require("lodash")

function clean() {
  del.sync(bin.root)
  del.sync("index.html")
}

var allPosts = []

function build() {
  makeChapters()
  buildIndex()
  buildChapters()
  console.log(allPosts)
}

function  buildIndex() {
  var template = "src/templates"
  var indexTpl = swig.compileFile(`${template}/index.html`);
  var indexParams = _.extend({allPosts}, params)
  var indexHTML = indexTpl(indexParams)
  fs.writeFileSync("./index.html", indexHTML)
}

function buildChapters() {
}

function makeChapters() {
  var chaptersPath = "src/chapters"
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
