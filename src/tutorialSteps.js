
export const TutorialSteps  = (pathname) => {
    let steps;
    switch(pathname){

        // Exercise List
        case '/': steps = [
            {
                selector: '#add-button',
                content: ['Add Exercises', 'This button takes you to a list of templates from which you can choose a one to work with.']
            },
            {
                selector: '#network-button',
                content: ['Network Button', 'Lets you share your exercises with other users.']
            },
            {
                selector: '#stop-button',
                content: ['Stop Button', 'Press this button to stop the activity, don\'t worry your changes will be saved in the Journal.']
            },
            {
                selector: '.play-button',
                content: ['Play Button', 'Use this button if you want to play the Exercise.']
            },
            {
                selector: '.edit-button',
                content: ['Edit Button', 'Use this button if you want to edit the Exercise.']
            },
            {
                selector: '.delete-button',
                content: ['Delete Button', 'Use this button if you want to delete the Exercise.']
            }
        ];
        break;
        
        // Add new Exercise
        case "/new": steps = [
            {
                selector: '.button-choose',
                content: ['Select Template', 'Click on this button to build an exercise using this template.']
            }
        ];
        break;

        // Scores
        case '/scores': steps = [
            {
                selector: '.score-button',
                content: ['Scores', 'Shows a graphical representation of the fraction of questions answered correctly.']
            },
            {
                selector: '.time-button',
                content: ['Time', 'Shows a graphical representation of the time taken.']
            },
            {
                selector: '.detail-button',
                content: ['Detailed Result', 'Comparison of your answers against the correct answers.']
            }
        ];
        break;

        // Shared Scores
        case '/presence/scores': steps = [
            {
                selector: '.score-button',
                content: ['Scores', 'Shows a graphical representation of the fraction of questions answered correctly.']
            },
            {
                selector: '.time-button',
                content: ['Time', 'Shows a graphical representation of the time taken.']
            },
            {
                selector: '.detail-button',
                content: ['Detailed Result', 'Comparison of answers of all users against the correct answers.']
            }
        ];
        break;

        // MCQ
        case '/new/mcq': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.question-options',
                content: ['Question Menu', 'Select the type of question you want to insert.']
            },
            {
                selector: '.button-choices-add',
                content: ['Add Option', 'Use this button to add another option field.']
            },
            {
                selector: '.button-choices-sub',
                content: ['Remove Option', 'Use this button to remove the last option field.']
            }
        ];
        break;  
        case '/edit/mcq': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.button-edit',
                content: ['Edit Question', 'Use this button to change the type of Question.']
            },
            {
                selector: '.button-choices-add',
                content: ['Add Option', 'Use this button to add another option field.']
            },
            {
                selector: '.button-choices-sub',
                content: ['Remove Option', 'Use this button to remove the last option field.']
            }
        ];
        break; 
        case '/play/mcq': steps = [
            {
                selector: '.choices',
                content: ['Select Choices', 'Select one of the options as your answer.']
            }
        ];
        break;
        
        // Cloze
        case '/new/cloze': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.question-options',
                content: ['Question Menu', 'Select the type of question you want to insert.']
            },
            {
                selector: '.button-choices-add',
                content: ['Add Cloze Option', 'Use this button to add another option field.']
            },
            {
                selector: '.button-choices-sub',
                content: ['Remove Cloze Option', 'Use this button to remove the last option field.']
            }
        ];
        break;  
        case '/edit/cloze': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.button-edit',
                content: ['Edit Question', 'Use this button to change the type of Question.']
            },
            {
                selector: '.button-choices-add',
                content: ['Add Cloze Option', 'Use this button to add another option field.']
            },
            {
                selector: '.button-choices-sub',
                content: ['Remove Cloze Option', 'Use this button to remove the last option field.']
            }
        ];
        break; 
        case '/play/cloze': steps = [
            {
                selector: '.answers',
                content: ['Cloze Answer', 'Select an option from the drop down or type your answer.']
            }
        ];
        break;

        // Reorder
        case '/new/reorder': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.question-options',
                content: ['Question Menu', 'Select the type of question you want to insert.']
            },
            {
                selector: '.up-button',
                content: ['Move option Up', 'Use this button to move the option up.']
            },
            {
                selector: '.down-button',
                content: ['Move option down', 'Use this button to move the option down.']
            },
            {
                selector: '.button-choices-add',
                content: ['Add Option', 'Use this button to add another option field.']
            },
            {
                selector: '.button-choices-sub',
                content: ['Remove Option', 'Use this button to remove the last option field.']
            }
        ];
        break;  
        case '/edit/reorder': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.button-edit',
                content: ['Edit Question', 'Use this button to change the type of Question.']
            },
            {
                selector: '.up-button',
                content: ['Move option Up', 'Use this button to move the option up.']
            },
            {
                selector: '.down-button',
                content: ['Move option Down', 'Use this button to move the option down.']
            },
            {
                selector: '.button-choices-add',
                content: ['Add Option', 'Use this button to add another option field.']
            },
            {
                selector: '.button-choices-sub',
                content: ['Remove Option', 'Use this button to remove the last option field.']
            }
        ];
        break; 
        case '/play/reorder': steps = [
            {
                selector: '.handler',
                content: ['Drag Handler', 'Use this handler to drag options up and down.']
            }
        ];
        break;

        // Group Assignment
        case '/new/group': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.button-choices-add',
                content: ['Add Option', 'Use this button to add another option field.']
            },
            {
                selector: '.button-choices-sub',
                content: ['Remove Option', 'Use this button to remove the last option field.']
            },
            {
                selector: '.question-options',
                content: ['Question Menu', 'Select the type of question you want to insert.']
            },
            {
                selector: '.answers',
                content: ['Select Group', 'Select the group from the dropdown to which this question belong.']
            }
        ];
        break;  
        case '/edit/group': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.button-choices-add',
                content: ['Add Option', 'Use this button to add another option field.']
            },
            {
                selector: '.button-choices-sub',
                content: ['Remove Option', 'Use this button to remove the last option field.']
            },
            {
                selector: '.button-edit',
                content: ['Edit Question', 'Use this button to change the type of Question.']
            },
            {
                selector: '.answers',
                content: ['Select Group', 'Select the group from the dropdown to which this question belong.']
            }
        ];
        break; 
        case '/play/group': steps = [
            {
                selector: '.box',
                content: ['Item', 'Drag this item to its correct group.']
            }
        ];
        break;


        // Free Text Input
        case '/new/freeText': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.question-options',
                content: ['Question Menu', 'Select the type of question you want to insert.']
            },
            {
                selector: '.answers',
                content: ['Answer', 'Type the answer here.']
            }
        ];
        break;  
        case '/edit/freeText': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.button-edit',
                content: ['Edit Question', 'Use this button to change the type of Question.']
            },
            {
                selector: '.answers',
                content: ['Answer', 'Type the answer here.']
            }
        ];
        break; 
        case '/play/freeText': steps = [
            {
                selector: '.input-freeText',
                content: ['Answer Box', 'Type the answer in this box.']
            }
        ];
        break;

        // Matching Pair
        case '/new/match': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.question-options',
                content: ['Question Menu', 'Select the type of question you want to insert.']
            }
        ];
        break;  
        case '/edit/match': steps = [
            {
                selector: '.button-thumbnail',
                content: ['Select Thumbnail', 'Choose a different thumbnail from the Journal Chooser.']
            },
            {
                selector: '.button-edit',
                content: ['Edit Question', 'Use this button to change the type of Question.']
            }
        ];
        break; 
        case '/play/match': steps = [
            {
                selector: '.box',
                content: ['Draw Connection', 'Select and drag the semicircle to its corresponding match.']
            }
        ];
        break;

        default: steps = [];
            break;
    }
    return steps;
}