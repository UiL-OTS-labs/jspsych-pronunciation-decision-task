/*
 * This file contains all the possible discrete sub trials of
 * a lexical decision task.
 */

/*
 * Presents the fixation cross
 */
let present_fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<span style="font-size:40px;">+</span>',
    choices: "NO_KEYS",
    trial_duration: FIXCROSS_DURATION,
    on_finish: function(data) {
        if (typeof data.rt == "number") {
            data.rt = Math.round(data.rt);
        }
    }
};

/*
 * This stimulus will present a forward mask
 */
let forward_mask = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        return "<p class='stimulus'>" +
            jsPsych.timelineVariable('forward_mask', true) +
            "</p>";
    },
    choices: "NO_KEYS",
    trial_duration: MASK_DURATION,
    data: { useful_data_flag: false },
    on_finish(data) {
        if (typeof data.rt == "number") {
            data.rt = Math.round(data.rt);
        }
    }
};

/*
 * This stimulus will present a visual prime stimulus
 */
let visual_prime = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        return "<p class='stimulus'>" +
            jsPsych.timelineVariable('visual_prime', true) + "</p>";
    },
    choices: "NO_KEYS",
    trial_duration: PRIME_DURATION,
    post_trial_gap: PRIME_GAP_DURATION,
    on_finish(data) {
        if (typeof data.rt == "number") {
            data.rt = Math.round(data.rt);
        }
    }
};

/*
 * This will present an auditory prime stimulus.
 */
let auditory_prime = {
    type : jsPsychAudioKeyboardResponse,
    stimulus : function() {return jsPsych.timelineVariable("auditory_prime");},
    choices : "NO_KEYS",
    trial_duration : PRIME_DURATION,
    post_trial_gap : PRIME_GAP_DURATION,
    on_finish(data) {
        if (typeof data.rt == "number") {
            data.rt = Math.round(data.rt);
        }
    }
}

/*
 * this will present a backwards mask.
 */
let backward_mask = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){
        return "<p class='stimulus'>" +
            jsPsych.timelineVariable('backward_mask', true) +
            "</p>";
    },
    choices: "NO_KEYS",
    trial_duration: MASK_DURATION,
    data: { useful_data_flag: false },
    on_finish(data) {
        if (typeof data.rt == "number") {
            data.rt = Math.round(data.rt);
        }
    }
}

/*
 * This will present an auditory target word. The participant should
 * decide whether it is a word or not.
 *
 * Note: At would be at least weird to have both an auditory and a visual target.
 */
let auditory_target = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: function() {
        return jsPsych.timelineVariable('auditory_target')
    },
    prompt: function() {
        return jsPsych.timelineVariable('word')
    },
    trial_duration: RESPONSE_TIMEOUT_DURATION,
    response_ends_trial: true,
    post_trial_gap: DEFAULT_ITI,
};

/*
 * This will present an visual target word. The participant should
 * decide whether it is a word or not.
 *
 * Note: At would be at least weird to have both an auditory and a visual target.
 */
let visual_target = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        return "<p class='stimulus'>" +
            jsPsych.timelineVariable('visual_target', true) +
            "</p>";
    },
    trial_duration: RESPONSE_TIMEOUT_DURATION,
    response_ends_trial: true,
    post_trial_gap: DEFAULT_ITI,
};

let present_feedback = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        let incorrect_feedback_text =
            `<span class="feedback_incorrect">${INCORRECT_TEXT}</span>`;
        let correct_feedback_text =
            `<span class="feedback_correct">${CORRECT_TEXT}</span>`;
        let last_resp_acc = jsPsych.data.getLastTrialData().values()[0].correct;
        if (last_resp_acc === true) {
            return correct_feedback_text
        }
        return incorrect_feedback_text;
    },
    choices: "NO_KEYS",
    trial_duration: FEEDBACK_DURATION,
    on_finish(data) {
        if (typeof data.rt == "number") {
            data.rt = Math.round(data.rt);
        }
    }
};
