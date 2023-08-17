
// stores wheter or not consent is given.
let g_consent_given = null;

/* CSS style for the consent form */
const CONSENT_HTML_STYLE_UU = `<style>
        body {
            background: rgb(246, 246, 246);
            font-family: "Open Sans","Frutiger",Helvetica,Arial,sans-serif;
            color: rgb(33, 37, 41);
            text-align: left;
        }

        p {
            line-height: 1.4; /* Override paragraph for better readability */
        }

        label {
            margin-bottom: 0;
        }

        h1, h2{
            font-size: 2rem;
        }

        h6 {
            font-size: 1.1rem;
        }

        /* Input styles */

        form > table th {
            padding-left: 10px;
            vertical-align: middle;
        }

        input, textarea, select {
            border-radius: 0;
            border: 1px solid #d7d7d7;
            padding: 5px 10px;
            line-height: 20px;
            font-size: 16px;
        }

        input[type=submit], input[type=button], button, .button, .jspsych-btn {
            background: #000;
            color: #fff;
            border: none;
            font-weight: bold;
            font-size: 15px;
            padding: 0 20px;
            line-height: 42px;
            width: auto;
            min-width: auto;
            cursor: pointer;
            display: inline-block;
            border-radius: 0;
        }

        input[type="checkbox"], input[type="radio"]
        {
            width: auto;
        }

        button[type=submit], input[type=submit], .button-colored {
            background: #ffcd00;
            color: #000000;
        }

        button[type=submit].button-black, input[type=submit].button-black {
            background: #000;
            color: #fff;
        }

        button a, .button a,
        button a:hover, .button a:hover,
        a.button, a.button:hover {
            color: #fff;
            text-decoration: none;
        }

        .button-colored a,
        .button-colored a:hover,
        a.button-colored,
        a.button-colored:hover {
            color: #000;
        }

        /* Table styles */
        table thead th {
            border-bottom: 1px solid #ccc;
        }

        table tfoot th {
            border-top: 1px solid #ccc;
        }

        table tbody tr:nth-of-type(odd) {
            background: #eee;
        }

        table tbody tr:hover {
            background: #ddd;
        }

        table tbody tr.no-background:hover, table tbody tr.no-background {
            background: transparent;
        }

        table tbody td, table thead th, table tfoot th {
            padding: 6px 5px;
        }

        /* Link styles */
        a {
            color: rgb(33, 37, 41);
            text-decoration: underline;
            transition: 0.2s ease color;
        }

        a:hover {
            transition: 0.2s ease color;
            color: rgb(85, 85, 95);
        }

        </style>
        `
const CONSENT_HTML = 
    '<p>' +
        'Welcome to the online questionnaire for the study Pronunciation Decision Task for Chinese Characters 23-113-02!' +
    '</p>' +
    '<p>' +
    	'This study is an online anonymous psycholinguistic study about the pronunciation of Chinese characters. In this study, you will first be exposed to Chinese characters with both written form and pronunciation, and then decide the pronunciation of certain Chinese characters. This study is designed and conducted by Chenyang Lin (c.lin7@students.uu.nl) for his master thesis. The data controller of this study is his supervisor, Dr. Iris Mulders (I.C.M.C.Mulders@uu.nl). This study will take about 10 minutes, and will not give any compensation.' +
    '</p>'+
    '<p>' +
    	'This study will collect your decision of the pronunciation of certain Chinese characters in the form of answers to multiple choice questions. In addition, personal information about birth year and month, native language (answered in the form of an open field), multilingualism, dyslexia, biological sex, handedness, whether you are able to speak Hindi, and whether you are able to read Chinese or Japanese, will also be collected in this precise order. Unfortunately, you cannot participate if you are younger than 18 years of age or older than 69 years, if you have dyslexia, if you do not speak Hindi, or if you are able to read Chinese or Japanese, which will result in automatic exclusion from participation. In this case, no data will be stored. However, if you participate, the collected data will be securely stored on YoDA (https://www.uu.nl/en/research/yoda) for at least 10 years. For this study, there is no collaboration with any external company or organization. The data may be shared with other researchers.' +
    '</p>'+
    '<p>' +
    	'Participation is voluntary. If you decide not to participate, you do not have to take any further action. If you do decide to participate, you can always change your mind and stop participating at any time, including during the study.' +
    '</p>' +
    '<p>' +
    	'This study has been approved by the Faculty Ethics Assessment Committee of the Faculty of Humanities (FEtC-H). If you have a complaint about the way this study is carried out, please send an email to the secretary of this Committee: fetc-gw@uu.nl.' +
    '</p>' +
    '<p>' +
    	'If you have any further question before, during or after the study, you may contact Dr. Iris Mulders (I.C.M.C.Mulders@uu.nl).' +
    '</p>';
const DEBRIEF_MESSAGE_NO_CONSENT = `
    <h1>You didn't check the checkbox!</h1><BR><BR>
    <h2>If you forgot to do so but were willing to voluntarily participate, please refresh the page and remember to check the checkbox under the information letter after reading it!</h2>
    `;
const DEBRIEF_MESSAGE_NO_CONSENT_DURATION = 20000;
const CONSENT_STATEMENT = `
    Yes, I have read and understood the information provided above and I voluntarily participate.
    `;

const PROCEED_BUTTON_TEXT = "Continue";
const CONSENT_REFERENCE_NAME = 'consent';
const IF_REQUIRED_FEEDBACK_MESSAGE = `
        NB: Please make sure you ticked the box before you continue!
        `

let consent_block = {
    type: jsPsychSurveyMultiSelect,
    preamble: CONSENT_HTML_STYLE_UU + CONSENT_HTML,
    required_message: IF_REQUIRED_FEEDBACK_MESSAGE,
    questions: [
        {
            prompt: "", 
            options: [CONSENT_STATEMENT], 
            horizontal: true,
            required: false,
            button_label: PROCEED_BUTTON_TEXT,
            name: CONSENT_REFERENCE_NAME
        }
    ],
    on_finish: function(data){
        let consent_choices = data.response.consent;
        let consent_statement = consent_choices.find(
            element => {return element === CONSENT_STATEMENT}
        );
        g_consent_given = consent_statement === CONSENT_STATEMENT;
        if (typeof data.rt === 'number') {
            data.rt = Math.round(data.rt);
        }
    }
};

let no_consent_end_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: DEBRIEF_MESSAGE_NO_CONSENT,
    choices: [],
    trial_duration: DEBRIEF_MESSAGE_NO_CONSENT_DURATION,
    on_finish: function (data){
        if (typeof data.rt === 'number') {
            data.rt = Math.round(data.rt);
        }
        jsPsych.endExperiment()
    }
};

let if_node_consent = {
    timeline: [no_consent_end_screen],
    conditional_function: function(data){
        if (g_consent_given){
            return false;
        } else {
            return true;
        }
    }
}

let consent_procedure = {
    timeline: [consent_block, if_node_consent]
}
