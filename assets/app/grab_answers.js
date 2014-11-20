$('.get-answer').on('click', function(){
  window.prompt("Ctrl-C your answer json bellow", localStorage.getItem('jtrinkleinLearnRX'));
});

$('.set-answer').on('click', function(){
  var text = '';
  text = window.prompt("Enter your answer json bellow");
  localStorage.setItem('jtrinkleinLearnRX', text);
  window.location.reload();
});
