/*
 * This file creates and starts the jsPsych timeline.
 * The sub parts/trials that represent the basic building blocks of the lexical
 * decision are in the file ld_trials.js.
 */

let jsPsych = initJsPsych(
    {
        exclusions: {
            min_width: MIN_WIDTH,
            min_height: MIN_HEIGHT
        }
    }
);

let start_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
        return "<div class='instruction' >" +
               "<p>" + GENERIC_CHECK + "</p></div>";
    },
    choices: [OK_BUTTON_TEXT],
    response_ends_trial: true,
    on_finish : function(data) {
        if (typeof data.rt === "number") {
            data.rt = Math.round(data.rt);
        }
    }
};

let instruction_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
        let text = 'In this experiment, you will be exposed to a lot of Chinese words (consisting of one or more characters) matched with pronunciations. After the exposure phase, you will be tested for the recognition of the pronunciations of some characters. The whole experiment will take about 9 minutes, during which the exposure phase will last about 7 minutes. Please make sure that you are in a quiet environment, and try to pay attention to the stimuli.';

        return "<div class='instruction' >" +
               "<p>" + text + "</p></div>";
    },
    choices: [OK_BUTTON_TEXT],
    response_ends_trial: true,
};


let preload_audio = {
    type : jsPsychPreload,
    message : PRELOAD_MSG,
    audio : [...getAudioStimuli(), AUDIO_TEST_STIMULUS]
};

let maybe_preload_audio = {
    timeline : [preload_audio],
    conditional_function : experimentUsesAudio
}


let well_done_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(){
        return "<div class='instruction' >" +
            '<p>' + PRE_TEST_INSTRUCTION + '</p></div>';
    },
    choices: [OK_BUTTON_TEXT],
    response_ends_trial: true,
    data: { useful_data_flag: false },
    on_finish : function(data) {
        if (typeof data.rt === "number") {
            data.rt = Math.round(data.rt);
        }
    }
};

let end_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: DEBRIEF_MESSAGE,
    choices: [],
    trial_duration: DEBRIEF_MESSAGE_DURATION,
    on_finish : function(data) {
        if (typeof data.rt === "number") {
            data.rt = Math.round(data.rt);
        }
    },
    on_load : function() {
        uil.saveData(ACCESS_KEY);
    }
};

let auditory_target = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: function() {
        return jsPsych.timelineVariable('auditory_target')
    },
    prompt: function() {
        return '<p style="font-size:3em">' + jsPsych.timelineVariable('word') + '</p>';
    },
    trial_duration: RESPONSE_TIMEOUT_DURATION,
    response_ends_trial: true,
    post_trial_gap: DEFAULT_ITI,
};

let fam_timeline = [
    auditory_target,
];

// (timeline) procedures //////////////////////////////////////////////////////////

let fam_procedure = {
    timeline: fam_timeline,
    timeline_variables: null
};

// regular JS functions


let pronunciation_question = {
    type: jsAudioSurvey,
    audio_prompt: '<p>Please listen to the following pronunciations:</p>',
    choice_prompt: function() {
	return '<p>I think the correct pronunciation for</p><div style="font-size:3em;">' + jsPsych.timelineVariable('character') + '</div><p>is:</p>'
    },
    label: jsPsych.timelineVariable('character'),
    audio_urls: function() { return uil.randomization.randomShuffle([
	'sounds/alternatives_du_mono_low.wav',
	'sounds/alternatives_mu_mono_low.wav',
	'sounds/alternatives_she_mono_low.wav',
	'sounds/vomit_tu_mono.wav',
	'sounds/alternatives_zao_mono_low.wav',
    ]) },
}

let pronunciation_questions = {
    timeline: [
	pronunciation_question
    ],
    timeline_variables: [
	{character: '土'},
	{character: '吐'},
	{character: '杜'},
	{character: '肚'},
	{character: '社'},
	{character: '牡'},
	{character: '灶'},
	{character: '扗'},
	{character: '釷'},
	{character: '圱'},
	{character: '汢'},
	{character: '靯'},
	{character: '芏'},
	{character: '圶'},
    ]
};

let exclusion_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [
	{
	    prompt: 'Do you speak Hindi?',
	    options: ['Yes', 'No'],
	    required: true,
	    horizontal: true
	},
	{
	    prompt: 'Can you read any of the following languages: Chinese, Japanese?',
	    options: ['Yes', 'No'],
	    required: true,
	    horizontal: true
	}
    ],

    on_finish: function(data) {
    }
}

let rejection_end_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: 'Unfortunately you cannot participate in this experiment because you do not meet our criteria for participants, but thanks for trying!',
    choices: [],
    trial_duration: 10000,
    on_finish: function() {
        // actually stop the experiment
        jsPsych.endExperiment()
    }
};

let check_rejection = {
    timeline: [
	rejection_end_screen
    ],
    conditional_function: function() {
	let last = jsPsych.data.get().last(4).values();
	let birthYear = parseInt(last[0].response.birth_year, 10);
	let birthMonth = parseInt(last[0].response.birth_month, 10);
	let dyslexic = last[1].response.Dyslexic == 'Yes';
	let hindi = last[3].response.Q0 == 'Yes';
	let chjp = last[3].response.Q1 == 'Yes';

	let now = new Date();
	let age = now.getFullYear() - birthYear;
	if (birthMonth > now.getMonth() + 1) age--;

	if (age < 18 || age > 69) {
	    return true;
	}
	if (dyslexic || !hindi || chjp) {
	    return true;
	}
	return false;
    }
};

function initExperiment(stimuli) {

    validateAllStimuli();

    console.log("The selected list is %s", stimuli.list_name);
    fam_procedure.timeline_variables = uil.randomization.randomShuffle(
        stimuli.table,
    );

    // randomize questions
    pronunciation_questions.timeline_variables = uil.randomization.randomShuffle(pronunciation_questions.timeline_variables);

    // Data added to the output of all trials.
    let subject_id = jsPsych.randomization.randomID(8);
    let list_name = stimuli.list_name;
    jsPsych.data.addProperties({
        subject: subject_id,
        list: list_name,
    });

    //////////////// timeline /////////////////////////////////

    let timeline = [];

    // it's best practice to have *mouse click* user I/O first
    timeline.push(start_screen);

    timeline.push(maybe_preload_audio);

    // Informed consent (consent.js)
    timeline.push(consent_procedure);

    // add survey
    timeline.push(survey_procedure);

    timeline.push(exclusion_question);
    timeline.push(check_rejection);

    // test/set audio level (sountest.js)
    timeline.push(maybe_test_audio);

    // instructions
    timeline.push(instruction_screen);

    // familiarization
    timeline.push(fam_procedure);

    timeline.push(pronunciation_questions);

    timeline.push(end_screen);

    // Start jsPsych when running on a Desktop or Laptop style pc.
    uil.browser.rejectMobileOrTablet();
    jsPsych.run(timeline);
}

function findList(name) {
    let list = TEST_ITEMS.find((entry) => entry.list_name === name);
    if (!list) {
        let found = TEST_ITEMS.map((entry) => `"${entry.list_name}"`).join(', ');
        console.error(
            `List not found "${name}".\n` +
                'This name was configured on the UiL datastore server.\n' +
                `The following lists exist in stimuli.js: \n${found}`)
    }
    return list;
}

function main() {
    // Make sure you've updated your key in globals.js
    uil.setAccessKey(ACCESS_KEY);
    uil.stopIfExperimentClosed();

    // Option 1: client side balancing:
    // let stimuli = pickRandomList();
    // initExperiment(stimuli);

     // Option 2: server side balancing:
     uil.session.start(ACCESS_KEY, (group_name) => {
          let stimuli = findList(group_name);
          initExperiment(stimuli);
     });
}
