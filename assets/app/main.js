var codeMirrors = [],
	last = new Date(),
	state = null;

window.updateTabs = function() {

};
window.onload = function() {

	/**
	 * Fix indentation of formatted code to not have any indentation
	 */
	$.each($('pre,textarea'), function(i, item) {
		removeIndentation(item);
	});


	/**
	 * Initialize lessons from previous session
	 */
	state = localStorage.getItem("newState");
/*	if (state) {
		state = JSON.parse(state);
		var firstUnfinishedQuestion;

		$(".lesson").each(function(cnt,item) {
			$('.lesson-link-'+cnt).show();

			var go = $(".go", item)[0],
				code = $(".code", item)[0],
				post = $(".post", item)[0];

			if (cnt < state.answers.length) {
				$(code).val(state.answers[cnt]);
				//item.style.visibility = "visible";
				$('#lesson-' + (cnt+1)).addClass('lesson-tab');
				if (post !== undefined) {
					//post.style.visibility = "visible";
				}
			}
			else if (cnt === state.answers.length) {
				//item.style.visibility = "visible";
			}
		});
	}
*/
	/**
	 * Initialize lessons
	 */
	var lessons = $(".lesson");
	lessons.hide();
	lessons.addClass('lesson-tab');
	lessons.each(function(cnt, item) {
		var me = $(item);
		me.attr('id', 'lesson-'+cnt);


		var go = $(".go", item)[0],
			output = $(".output", item)[0],
			code = $(".code", item)[0],
			showAnswer = $(".showAnswer", item)[0],
			answer = $(".answer", item).text(),
			resetSprite = $(".resetSprite", item)[0],
			sprite = $(".sprite", item)[0],
			codeMirror = CodeMirror.fromTextArea(code, {
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
			post = $(".post", item)[0],
			verifierScript = $(".verifier", item).text(),
			controls = $(".control", item);

		codeMirrors.push(codeMirror);
		go.onclick = function() {
			try {
				var verifier = eval("(" + verifierScript + ")");

				try {
					codeMirror.save();
					saveAllAnswers();
					verifier($(code).val(), item);
					if (post !== undefined) {
						//post.style.visibility = "visible";
					}
					if (cnt < lessons.length - 1) {
						//lessons[cnt + 1].style.visibility = "visible";
						$('.lesson-link-' + (cnt+1)).show();
					}

				} catch (ex) {
					alert(ex);
				}
			} catch (ex) {
				alert(ex);
			}
		};

		if (showAnswer) {
			showAnswer.onclick = function() {
				codeMirror.setValue(answer);
			};
		}

		if (resetSprite) {
			resetSprite.onclick = function() {
				if (sprite) {
					sprite.style.top = sprite.style.left = "";
				}
			};
		}

	});
	$("#tablist").empty();
	$("#tablist").append('<li><a href="#intro" >Introduction</a></li>');
	$('.lesson-tab').each(function(index,item) {
		$("#tablist").append('<li class="lesson-link lesson-link-' + index + '"><a href="#' + item.id + '" >Lesson ' + index + '</a></li>');
		$('.lesson-link-' + index).click(function(){
			codeMirrors[index].setSize();
		});
	});

	$( "#content" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
	$( "#tablist li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
    $('.lesson-link').hide();
    $('.lesson-link').first().show();

}
