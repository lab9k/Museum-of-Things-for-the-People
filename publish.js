const github_pages = require('gh-pages');

github_pages.publish('.', { dotfiles: true }, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('Push succesfull');
  }
});
