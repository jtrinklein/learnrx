var codeMirrors = [],
	last = new Date(),
	state = null;

function initTabs() {
	$('.lesson-link').hide();
	$('.lesson-link').first().show();
	$('.lesson-tab').each(function(index,item) {
		$('.lesson-link-' + index).on('click', function(){
			codeMirrors[index].setSize();
		});
	});

	$( "#content" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
	$( "#tablist li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );

}

function restoreStateFromStorage() {
	state = localStorage.getItem('jtrinkleinLearnRX');
	if (!state) {
		return;
	}

	state = JSON.parse(state);

	if (!state.answers) {
		return;
	}

	state.answers.forEach(function(answer,index) {
		var lesson = $('#lesson-' + index);
		lesson.find('.code').val(answer);

		var verifier = window.getVerifierForLessonByIndex(index);

		if (window.answerIsVerified(verifier, answer, lesson[0])) {
			lesson.find('.post').show();
			$('.lesson-link-' + (index+1)).show();
		}

	});

}
window.onload = function() {
	initTabs();
	/**
	 * Fix indentation of formatted code to not have any indentation
	 */
	$.each($('pre,textarea'), function(i, item) {
		removeIndentation(item);
	});

	/**
	 * Initialize lessons
	 */
	var lessons = $(".lesson");
	lessons.hide();
	lessons.find('.post').hide();

	/**
	* Initialize lessons from previous session
	*/
	restoreStateFromStorage();

	lessons.each(function(cnt, item) {
		var lesson = $(item);

		var go = lesson.find('.go'),
			output = lesson.find('.output'),
			code = lesson.find('.code'),
			showAnswer = lesson.find('.showAnswer'),
			answer = lesson.find('.answer').text(),
			resetSprite = lesson.find('.resetSprite'),
			sprite = lesson.find('.sprite'),
			codeMirror = CodeMirror.fromTextArea(code[0], {
				lineNumbers: true,
				matchBrackets: true,
				mode: "text/typescript",
				tabSize: 2,
				indentWithTabs: false,
				extraKeys: {
					"F4": function(cm) {
					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
					},
					"Esc": function(cm) {
					if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
					}
				}
			}),
			post = lesson.find('.post'),
			verifierScript = lesson.find('.verifier').text(),
			controls = lesson.find('.control');

		codeMirrors.push(codeMirror);
		go.on('click', function() {
			try {
				var verifier = eval("(" + verifierScript + ")");

				codeMirror.save();
				saveAllAnswers();
				verifier($(code).val(), item);
				post.show();
				// show next lesson link
				if (cnt < (lessons.length - 1)) {
					$('.lesson-link-' + (cnt+1)).show();
				}

			} catch (ex) {
				alert(ex);
			}
		});

		showAnswer.on('click',function() {
			codeMirror.setValue(answer);
		});

		resetSprite.on('click',function() {
			sprite.css('top', 0);
			sprite.css('left', 0);
		});

	});

	var visibleLinks = $('.lesson-link:visible');
	if (visibleLinks.length > 1) {
		visibleLinks.last().find('a').click();
	}


}
