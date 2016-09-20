# gulp-estilo

Plugin de `gulp.js` usado internamente en [Estudio Cíclope](http://ciclo.pe/)
para validar nuestra guía de estilo de `html`, `css` y `javascript`.

El plugin usa `gulp-htmllint`, `gulp-csslint` y `gulp-eslint`.

## Ejemplo

```js
const Gulp = require('gulp');
const Estilo = require('gulp-estilo');


Gulp.task('htmllint', (done) => {

  Gulp.src('www/index.html')
    .pipe(Estilo.html());
});


Gulp.task('csslint', () => {

  return Gulp.src('www/css/style.css')
    .pipe(Estilo.css());
});


Gulp.task('eslint', () => {

  return Gulp.src(['gulpfile.js', 'www/js/main.js'])
    .pipe(Estilo.js());
});


Gulp.task('lint', ['htmllint', 'csslint', 'eslint']);
```
