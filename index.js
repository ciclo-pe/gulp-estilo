'use strict';


const Path = require('path');
const Gutil = require('gulp-util');
const Lazypipe = require('lazypipe');
const Csslint = require('gulp-csslint');
const Eslint = require('gulp-eslint');
const Htmllint = require('gulp-htmllint');


const internals = {};


internals.htmlRules = {
  'indent-style': 'spaces',
  'indent-width': 2,
  'doctype-html5': true,
  'doctype-first': true,
  'class-style': 'dash',
  'id-class-style': 'dash',
  'tag-name-match': true,
  'tag-self-close': 'never',
  'title-no-dup': true,
  'attr-name-style': 'dash'
};


internals.htmlReporter = function (filepath, issues) {

  console.log(Gutil.colors.underline(filepath));

  issues.sort((a, b) => {

    if (a.line > b.line) {
      return 1;
    }
    else if (a.line < b.line) {
      return -1;
    }
    else {
      return 0;
    }
  });

  issues.forEach((issue) => {

    console.log([
      ' ',
      Gutil.colors.gray(issue.line + ':' + issue.column),
      Gutil.colors.red('error'),
      issue.code + ':', issue.msg,
      Gutil.colors.gray(issue.rule),
      Gutil.colors.cyan(JSON.stringify(issue.data))
    ].join(' '));
  });

  if (issues.length) {
    console.log(Gutil.colors.red(issues.length + ' HTML issues'));
  }
  else {
    console.log(Gutil.colors.green('No HTML issues! Yay!'));
  }
};


internals.cssReporter = function (results, filename, options) {

  const typeColors = {
    warning: 'yellow',
    error: 'red'
  };

  console.log(Gutil.colors.underline(filename));
  results.messages.forEach(message => {

    const out = [' '];

    if (message.line) {
      out.push(Gutil.colors.gray(message.line + ':' + message.col));
    }

    out.push(
      Gutil.colors[typeColors[message.type] || 'gray'](message.type),
      message.message,
      Gutil.colors.gray(message.rule.id),
      Gutil.colors.cyan(message.evidence)
    );

    console.log(out.join(' '));
  });
};


exports.html = Lazypipe()
  .pipe(Htmllint, {
    rules: internals.htmlRules
  }, internals.htmlReporter);


exports.css = Lazypipe()
  .pipe(Csslint)
  .pipe(Csslint.formatter, internals.cssReporter)
  .pipe(Csslint.formatter, 'fail');


exports.js = Lazypipe()
  .pipe(Eslint, { configFile: Path.join(__dirname, '.eslintrc') })
  .pipe(Eslint.format)
  .pipe(Eslint.failAfterError);
