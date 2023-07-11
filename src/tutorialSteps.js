export const tutorialSteps = (pathname, intl) => {
	let steps;
	switch (pathname) {
		// Exercise List
		case "/":
			steps = [];
			if (document.getElementById("editor-button")) {
				steps = [
					{
						title: intl.formatMessage({ id: "Exerciser" }),
						intro: intl.formatMessage({ id: "This activity is an academic focused activity for the Sugarizer platform. It provides teachers to build interactive exercises for students, using multiple templates, and share them with their students using the sugarizer-server." }),
						
					},
					{
						element: "#network-button",
						title: intl.formatMessage({ id: "Network Button" }),
						intro: intl.formatMessage({ id: "Lets you share your exercises with other users." })
					},
					{
						element: "#run-all-button",
						title: intl.formatMessage({ id: "Run All Button" }),
						intro: intl.formatMessage({ id: "Use this button to play all the exercises together." }),
						
					},
					{
						element: "#editor-button",
						title: intl.formatMessage({ id: "Editor Button" }),
						intro: intl.formatMessage({ id: "Press this button to enter editor mode and edit/add/delete your exercises" }),
						
					},
					{
						element: "#evaluate-button",
						title: intl.formatMessage({ id: "Evaluate Button" }),
						intro: intl.formatMessage({ id: "Use this button to export the exercises set as an evaluation." })
					},
					{
						element: "#fullscreen-button",
						title: intl.formatMessage({ id: "Fullscreen Button" }),
						intro: intl.formatMessage({ id: "Press this button to enter Fullscreen mode." })
					},
					{
						element: "#stop-button",
						title: intl.formatMessage({ id: "Stop Button" }),
						intro: intl.formatMessage({ id: 'Press this button to stop the activity, don"t worry your changes will be saved in the Journal.' }),
						
					},
					{
						element: ".play-button",
						title: intl.formatMessage({ id: "Play Button" }),
						intro: intl.formatMessage({ id: "Use this button if you want to play the Exercise." })
					},
				];
			} else if (document.getElementById("play-button")) {
				steps = [
					{
						element: "#play-button",
						title: intl.formatMessage({ id: "Play button" }),
						intro: intl.formatMessage({ id: "Press this button to exit edit mode and return to the play mode." }),
					},
					{
						element: "#add-button",
						title: intl.formatMessage({ id: "Add Exercises" }),
						intro: intl.formatMessage({ id: "This button takes you to a list of templates from which you can choose a one to work with." })
					},
					{
						element: ".edit-button",
						title: intl.formatMessage({ id: "Edit Button" }),
						intro: intl.formatMessage({ id: "Use this button if you want to edit the Exercise." })
					},
					{
						element: ".delete-button",
						title: intl.formatMessage({ id: "Delete Button" }),
						intro: intl.formatMessage({ id: "Use this button if you want to delete the Exercise." })
					},
				];
			} else { // Evaluation mode
				steps = [
					{
						element: "#run-all-button",
						title: intl.formatMessage({ id: "Run All Button" }),
						intro: intl.formatMessage({ id: "Use this button to play all the exercises together." }),
					},
					{
						element: "#fullscreen-button",
						title: intl.formatMessage({ id: "Fullscreen Button" }),
						intro: intl.formatMessage({ id: "Press this button to enter Fullscreen mode." }),
					},
					{
						element: "#stop-button",
						title: intl.formatMessage({ id: "Stop Button" }),
						intro: intl.formatMessage({ id: 'Press this button to stop the activity, don"t worry your changes will be saved in the Journal.' }),
					},
					{
						element: ".play-button",
						title: intl.formatMessage({ id: "Play Button" }),
						intro: intl.formatMessage({ id: "Use this button if you want to play the Exercise." })
					},
				];
			}
			if (document.getElementsByClassName("share-button")[0]) {
				steps.push({
					element: ".share-button",
					title: intl.formatMessage({ id: "Share Button" }),
					intro: intl.formatMessage({ id: "Use this button if you want to share this Exercise." }),
				});
			}
			if (document.getElementsByClassName("result-button")[0]) {
				steps.push({
					element: ".result-button",
					title: intl.formatMessage({ id: "Result Button" }),
					intro: intl.formatMessage({ id: "Use this button to see results of all the users." }),
				});
			}
			if (document.getElementsByClassName("user-list-button")[0]) {
				steps.push({
					element: ".user-list-button",
					title: intl.formatMessage({ id: "User List Button" }),
					intro: intl.formatMessage({ id: "Use this button to see list of all the users." }),
				});
			}
			break;

		// Add new Exercise
		case "/new":
			steps = [
				{
					element: ".button-choose",
					title: intl.formatMessage({ id: "Select Template" }),
					intro: intl.formatMessage({ id: "Click on this button to build an exercise using this template." }),
				},
				{

				}
			];
			break;

		// Scores
		case "/scores":
			steps = [
				{
					element: ".score-button",
					title: intl.formatMessage({ id: "Scores" }),
					intro: intl.formatMessage({ id: "Shows a graphical representation of the fraction of questions answered correctly." })
				},
				{
					element: ".time-button",
					title: intl.formatMessage({ id: "Time" }),
					intro: intl.formatMessage({ id: "Shows a graphical representation of the time taken." }),
				},
				{
					element: ".detail-button",
					title: intl.formatMessage({ id: "Detailed Result" }),
					intro: intl.formatMessage({ id: "Comparison of your answers against the correct answers." }),
				},
			];
			break;

		// Shared Scores
		case "/presence/scores":
			steps = [
				{
					element: ".score-button",
					title: intl.formatMessage({ id: "Scores" }),
					intro: intl.formatMessage({ id: "Shows a graphical representation of the fraction of questions answered correctly." }),
				},
				{
					element: ".time-button",
					title: intl.formatMessage({ id: "Time" }),
					intro: intl.formatMessage({ id: "Shows a graphical representation of the time taken." }),
				},
				{
					element: ".detail-button",
					title: intl.formatMessage({ id: "Detailed Result" }),
					intro: intl.formatMessage({ id: "Comparison of answers of all users against the correct answers." }),
				},
			];
			break;

		// MCQ
		case "/new/mcq":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".question-options",
					title: intl.formatMessage({ id: "Question Menu" }),
					intro: intl.formatMessage({ id: "Select the type of question you want to insert." }),
				},
				{
					element: ".button-choices-add",
					title: intl.formatMessage({ id: "Add Option" }),
					intro: intl.formatMessage({ id: "Use this button to add another option field." }),
				},
				{
					element: ".button-choices-sub",
					title: intl.formatMessage({ id: "Remove Option" }),
					intro: intl.formatMessage({ id: "Use this button to remove the last option field." }),
				},
			];
			break;
		case "/edit/mcq":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".button-edit",
					title: intl.formatMessage({ id: "Edit Question" }),
					intro: intl.formatMessage({ id: "Use this button to change the type of Question." }),
				},
				{
					element: ".button-choices-add",
					title: intl.formatMessage({ id: "Add Option" }),
					intro: intl.formatMessage({ id: "Use this button to add another option field." }),
				},
				{
					element: ".button-choices-sub",
					title: intl.formatMessage({ id: "Remove Option" }),
					intro: intl.formatMessage({ id: "Use this button to remove the last option field." }),
				},
			];
			break;
		case "/play/mcq":
			steps = [
				{
					element: ".choices",
					title: intl.formatMessage({ id: "Select Choices" }),
					intro: intl.formatMessage({ id: "Select one of the options as your answer." }),
				},
				{

				}
			];
			break;

		// Cloze
		case "/new/cloze":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." })
				},
				{
					element: ".question-options",
					title: intl.formatMessage({ id: "Question Menu" }),
					intro: intl.formatMessage({ id: "Select the type of question you want to insert." }),
				},
				{
					element: ".type-write",
					title: intl.formatMessage({ id: "Blank Type" }),
					intro: intl.formatMessage({ id: "Let's user write answers in blanks." }),
				},
				{
					element: ".type-options",
					title: intl.formatMessage({ id: "Blank Type" }),
					intro: intl.formatMessage({ id: "Let's user select answer from a drop down menu." }),
				},
				{
					element: ".button-add-blank",
					title: intl.formatMessage({ id: "Add Blank" }),
					intro: intl.formatMessage({ id: "Click on this button to insert blanks in the questions. The number of blanks should be less than the number of options." }),
				},
				{
					element: "#cloze-text",
					title: intl.formatMessage({ id: "Cloze Text" }),
					intro: intl.formatMessage({ id: "The string represented by -{Number}- is replaced by a blank or a drop down menu in the preview, also the ith blank's answer is represented by the ith option field." }),
				},
				{
					element: ".button-choices-add",
					title: intl.formatMessage({ id: "Add Option" }),
					intro: intl.formatMessage({ id: "Use this button to add another option field." }),
				},
				{
					element: ".button-choices-sub",
					title: intl.formatMessage({ id: "Remove Option" }),
					intro: intl.formatMessage({ id: "Use this button to remove the last option field." }),
				},
			];
			break;
		case "/edit/cloze":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".button-edit",
					title: intl.formatMessage({ id: "Edit Question" }),
					intro: intl.formatMessage({ id: "Use this button to change the type of Question." }),
				},
				{
					element: ".type-write",
					title: intl.formatMessage({ id: "Blank Type" }),
					intro: intl.formatMessage({ id: "Let's user write answers in blanks." }),
				},
				{
					element: ".type-options",
					title: intl.formatMessage({ id: "Blank Type" }),
					intro: intl.formatMessage({ id: "Let's user select answer from a drop down menu." }),
				},
				{
					element: ".button-add-blank",
					title: intl.formatMessage({ id: "Add Blank" }),
					intro: intl.formatMessage({ id: "Click on this button to insert blanks in the questions. The number of blanks should be less than the number of options." }),
				},
				{
					element: "#cloze-text",
					title: intl.formatMessage({ id: "Cloze Text" }),
					intro: intl.formatMessage({ id: "The string represented by -{Number}- is replaced by a blank or a drop down menu in the preview, also the ith blank's answer is represented by the ith option field." }),
				},
				{
					element: ".button-choices-add",
					title: intl.formatMessage({ id: "Add Option" }),
					intro: intl.formatMessage({ id: "Use this button to add another option field." }),
				},
				{
					element: ".button-choices-sub",
					title: intl.formatMessage({ id: "Remove Option" }),
					intro: intl.formatMessage({ id: "Use this button to remove the last option field." }),
				},
			];
			break;
		case "/play/cloze":
			steps = [
				{
					element: ".answers",
					title: intl.formatMessage({ id: "Cloze Answer" }),
					intro: intl.formatMessage({ id: "Select an option from the drop down or type your answer." }),
				},
				{

				}
			];
			break;

		// Reorder
		case "/new/reorder":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".question-options",
					title: intl.formatMessage({ id: "Question Menu" }),
					intro: intl.formatMessage({ id: "Select the type of question you want to insert." }),
				},
				{
					element: ".up-button",
					title: intl.formatMessage({ id: "Move option Up" }),
					intro: intl.formatMessage({ id: "Use this button to move the option up." }),
				},
				{
					element: ".down-button",
					title: intl.formatMessage({ id: "Move option down" }),
					intro: intl.formatMessage({ id: "Use this button to move the option down." }),
				},
				{
					element: ".button-choices-add",
					title: intl.formatMessage({ id: "Add Option" }),
					intro: intl.formatMessage({ id: "Use this button to add another option field." }),
				},
				{
					element: ".button-choices-sub",
					title: intl.formatMessage({ id: "Remove Option" }),
					intro: intl.formatMessage({ id: "Use this button to remove the last option field." }),
				},
			];
			break;
		case "/edit/reorder":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".button-edit",
					title: intl.formatMessage({ id: "Edit Question" }),
					intro: intl.formatMessage({ id: "Use this button to change the type of Question." }),
				},
				{
					element: ".up-button",
					title: intl.formatMessage({ id: "Move option Up" }),
					intro: intl.formatMessage({ id: "Use this button to move the option up." }),
				},
				{
					element: ".down-button",
					title: intl.formatMessage({ id: "Move option Down" }),
					intro: intl.formatMessage({ id: "Use this button to move the option down." }),
				},
				{
					element: ".button-choices-add",
					title: intl.formatMessage({ id: "Add Option" }),
					intro: intl.formatMessage({ id: "Use this button to add another option field." }),
				},
				{
					element: ".button-choices-sub",
					title: intl.formatMessage({ id: "Remove Option" }),
					intro: intl.formatMessage({ id: "Use this button to remove the last option field." }),
				},
			];
			break;
		case "/play/reorder":
			steps = [
				{
					element: ".handler",
					title: intl.formatMessage({ id: "Drag Handler" }),
					intro: intl.formatMessage({ id: "Use this handler to drag options up and down." }),
				},
				{

				}
			];
			break;

		// Group Assignment
		case "/new/group":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".group-option-type",
					title: intl.formatMessage({ id: "Group Type" }),
					intro: intl.formatMessage({ id: "Select between group type to be text or image." }),
					
				},
				{
					element: ".button-choices-add",
					title: intl.formatMessage({ id: "Add Option" }),
					intro: intl.formatMessage({ id: "Use this button to add another option field." }),
				},
				{
					element: ".button-choices-sub",
					title: intl.formatMessage({ id: "Remove Option" }),
					intro: intl.formatMessage({ id: "Use this button to remove the last option field." }),
				},
				{
					element: ".question-options",
					title: intl.formatMessage({ id: "Question Menu" }),
					intro: intl.formatMessage({ id: "Select the type of question you want to insert." }),
				},
				{
					element: ".answers",
					title: intl.formatMessage({ id: "Select Group" }),
					intro: intl.formatMessage({ id: "Select the group from the dropdown to which this question belong." }),
				},
			];
			break;
		case "/edit/group":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".button-choices-edit",
					title: intl.formatMessage({ id: "Edit Group Type" }),
					intro: intl.formatMessage({ id: "Edit group type to select between text and image." }),
				},
				{
					element: ".button-choices-add",
					title: intl.formatMessage({ id: "Add Option" }),
					intro: intl.formatMessage({ id: "Use this button to add another option field." }),
				},
				{
					element: ".button-choices-sub",
					title: intl.formatMessage({ id: "Remove Option" }),
					intro: intl.formatMessage({ id: "Use this button to remove the last option field." }),
				},
				{
					element: ".button-edit",
					title: intl.formatMessage({ id: "Edit Question" }),
					intro: intl.formatMessage({ id: "Use this button to change the type of Question." }),
				},
				{
					element: ".group-answer",
					title: intl.formatMessage({ id: "Select Group" }),
					intro: intl.formatMessage({ id: "Select the group from the dropdown to which this question belong." }),
				},
			];
			break;
		case "/play/group":
			steps = [
				{
					element: ".box",
					title: intl.formatMessage({ id: "Item" }),
					intro: intl.formatMessage({ id: "Drag this item to its correct group." }),
				},
				{

				}
			];
			break;

		// Free Text Input
		case "/new/freeText":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".question-options",
					title: intl.formatMessage({ id: "Question Menu" }),
					intro: intl.formatMessage({ id: "Select the type of question you want to insert." }),
				},
				{
					element: ".answers",
					title: intl.formatMessage({ id: "Answer" }),
					intro: intl.formatMessage({ id: "Type the answer here." }),
				},
			];
			break;
		case "/edit/freeText":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".button-edit",
					title: intl.formatMessage({ id: "Edit Question" }),
					intro: intl.formatMessage({ id: "Use this button to change the type of Question." }),
				},
				{
					element: ".answers",
					title: intl.formatMessage({ id: "Answer" }),
					intro: intl.formatMessage({ id: "Type the answer here." }),
				},
			];
			break;
		case "/play/freeText":
			steps = [
				{
					element: ".input-freeText",
					title: intl.formatMessage({ id: "Answer Box" }),
					intro: intl.formatMessage({ id: "Type the answer in this box." }),
				},
				{

				}
			];
			break;

		// Matching Pair
		case "/new/match":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".question-options",
					title: intl.formatMessage({ id: "Item Menu" }),
					intro: intl.formatMessage({ id: "Select the type of item you want to insert." }),
				},
			];
			break;
		case "/edit/match":
			steps = [
				{
					element: ".button-thumbnail",
					title: intl.formatMessage({ id: "Select Thumbnail" }),
					intro: intl.formatMessage({ id: "Choose a different thumbnail from the Journal Chooser." }),
				},
				{
					element: ".button-edit",
					title: intl.formatMessage({ id: "Edit Item" }),
					intro: intl.formatMessage({ id: "Use this button to change the type of the item." }),
				},
			];
			break;
		case "/play/match":
			steps = [
				{
					element: ".box",
					title: intl.formatMessage({ id: "Draw Connection" }),
					intro: intl.formatMessage({ id: "Select and drag the semicircle to its corresponding match." }),
				},
				{

				}
			];
			break;

		// Word Puzzle
		case "/new/wordpuzzle":
			steps = [];
			break;
		case "/edit/wordpuzzle":
			steps = [];
			break;
		case "/play/wordpuzzle":
			steps = [
				{
					element: ".word-grid",
					title: intl.formatMessage({ id: "Word Puzzle" }),
					intro: intl.formatMessage({ id: "Your goal is to find as many words as you can in the puzzle based on the given questions." }),
				},
				{

				}
			];
			break;

		default:
			steps = [];
			break;
	}
	return steps;
};
