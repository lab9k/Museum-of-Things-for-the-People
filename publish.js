const github_pages = require('gh-pages');

github_pages.publish('_site', function(err) {
  console.error(err);
});
