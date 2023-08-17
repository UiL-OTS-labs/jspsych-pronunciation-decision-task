
var jsAudioSurvey = (function (jspsych) {
    "use strict";

    const info = {
	name: "AUDIO-SURVEY",
	parameters: {
	    audio_urls: {
		type: jspsych.ParameterType.LIST,
		default: [],
	    },
	    choice_prompt: {
		type: jspsych.ParameterType.HTML_STRING,
		default: null,
	    },
	},
    };

    class AudioSurveyPlugin {
	constructor(jsPsych) {
	    this.jsPsych = jsPsych;
	}

	trial(display_element, trial) {
	    // data saving
	    var trial_data = {
		response: "parameter value",
	    };

	    let radioButtons = trial.audio_urls.map((url, idx) => `<label><input required type="radio" name="pronunciation" value="${url}">${idx+1}</label>`).join('');

	    let html = `
                ${trial.audio_prompt}
		<div class="audio-buttons" style="display: flex; justify-content:space-between;">
		</div>
		<p>
		    <form>
			${trial.choice_prompt}
			<div style="display:flex; justify-content:space-between">
			    ${radioButtons}
			</div>

			<p>
			    <button class="jspsych-btn">Continue</button>
			</p>
		    </form>
		</p>
	    `;

	    display_element.innerHTML = html;
	    display_element.querySelector('form').addEventListener('submit', (event) => {
		event.preventDefault();
		let trial_data = {
		    pronunciation: event.target.pronunciation.value,
		    label: trial.label
		}
		this.jsPsych.finishTrial(trial_data);
	    });

	    let buttons = display_element.querySelector('.audio-buttons');

	    trial.audio_urls.forEach((url, idx) => {
		let button = document.createElement('button');
		button.classList.add('jspsych-btn');
		button.innerText = idx + 1;
		buttons.append(button);

		let audio = new Audio(url);
		button.addEventListener('click', event => {
		    audio.play();
		});
	    });
	    // end trial
	}

    }
    AudioSurveyPlugin.info = info;

    return AudioSurveyPlugin;
})(jsPsychModule);
