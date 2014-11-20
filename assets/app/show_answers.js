$('.show-answers').on('click', function(){
    $('.lesson-link').show();
    window.codeMirrors.forEach(function(codeMirror, index) {
        var lesson = $('#lesson-' + index),
            answer = lesson.find('.answer').text();

        lesson.find('.code').val(answer);
        lesson.find('.post').show();
        codeMirror.setValue(answer);
        codeMirror.save();
    });
});
