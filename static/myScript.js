/* 
File Contents: text editor & text autocomplete functionality for editor.html 
1. Rich Text Editor - Quill.js - open source rich text editor library - DOCUMENTATION: https://quilljs.com/docs/quickstart/
2. Text autocomplete - Awesomplete - simple autocomplete widget for input tags - DOCUMENTATION: https://projects.verou.me/awesomplete/
3. Text Fomatting - Cleave.js - format your input tags while typing - DOCUMENTATION: https://nosir.github.io/cleave.js/
4. Function to hide and show text editor form - to meet start working day and end working day user story
*/

// Rich Text Editor - Quill.js

//keyboard bindings are declared to allow user to use shortcuts to input text snippets
//bindings variable will be used when initializing quill editor
var bindings = {

  //keyboard binding for CAR COUNT text snippet
  carCountSnippet: {
    // CAR COUNT text snippet is added with control + C keys
    key: 'C',
    ctrlKey: true,

    //function is used to insert text snippet into quill
    handler: function() {
      quill.insertText(0, "CAR COUNT: A's:  B's:  C's:  D's:  E's:  L's:  M's:  TOTAL:  ", 'bold', true);
    }
  },

  //keyboard binding for COMMUTE SCAM text snippet
  custom1: {
    //COMMUTE SCAM text snippet is added with control + B keys
    key: 'B',
    ctrlKey: true,

    //function is used to insert text snippet into quill
    handler: function() {
      quill.insertText(0, "COMMUTE SCRAM \nRush Rating: \nSCRAM Compliant: \nTrains: \nCars: \nShort: \nNotes/Refs: \n                                        ", 'bold', true);
    }
  },
};

//initialzing quill editor
//id editor-container is used in editor.html on div tag
var quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      //ability to change font sizes
      [{ 'size': ['small', false, 'large', 'huge'] }],    
      //ability to bold, italic, underline, and strikethrough 
      ['bold', 'italic', 'underline','strike'],
      //ability to change font color and highlight
      [{ 'color': [] }, { 'background': [] }], 
      //ability to make list, bullet points, and change indentation 
      [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'indent': '-1'}, { 'indent': '+1' }],
      //ability to center, left or right text
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],  
      //abiliy to upload image and add code
      ['image', 'code-block'],
      //ability to remove all formating on text
      ['clean'],
    ],
    //bindings are added to keyboard for text snippet functionality 
    keyboard: {
      bindings: bindings
    }
  },
    //text to display before user types 
    placeholder: 'Event Description',
    //theme snow is default for quill js
    theme: 'snow' 
});


//getting content from quill editor and assigning it input tag labeled 'about' in the editor.html page
var form = document.querySelector('form');
form.onsubmit = function() {
  //populate hidden form on submit
  //allow about var be the input variable in editor.html
  var about = document.querySelector('input[name=about]');
  //assign the value of about to innerHTML for ease of use displaying 
  about.value = quill.root.innerHTML;
};

//end of Rich Text Editor

// Text autocomplete - Awesomplete

//initliazed awesomplete widget for input tag in editor.html with id "tags"
var tagsInput = document.getElementById("tags");
new Awesomplete(tagsInput, {

  list: [
    //list of posssible auto-complete options
    //in the future list should be moved outside of initilization and refrenced here instead
		{ label: "POWER: 34.5kV Cable Problem includes PG&E, breaker issues,", value: "POWER" },
		{ label: "GEALOC: Gealoc Issue/Failure", value: "GEALOC" },
		{ label: "311: Doors not opening in ATO", value: "311" },
    { label: "IFO: Intermittent False Occupancy", value: "IFO" },
		{ label: "FO: Solid False Occupancy", value: "FO" },
		{ label: "HENCFIRE: Homeless encampment-related fire incident", value: "HENCFIRE" },
    { label: "HENCPD: Homeless encampment-related police incident", value: "HENCPD" },
		{ label: "TRESPASS: Unauthorized person walking wayside", value: "TRESPASS" },
		{ label: "FENCE: Hole/damage to wayside fence or open gate incident", value: "FENCE" },
    { label: "STRIKE: Individual struck wayside", value: "STRIKE" },
		{ label: "MUX: failure resulting in FO’s through entire MUX boundary", value: "MUX" },
		{ label: "MDRX: Medical incidents responded to by on-duty Medics (ie: Medic-16 & Medic-10)", value: "MDRX" },
    { label: "DERAIL: Derailment incident", value: "DERAIL" },
		{ label: "ZERO: Zero speed codes issue(s)", value: "ZERO" },
		{ label: "PLATTRIP: Platform trip activated", value: "PLATTRIP" },
		{ label: "CATA: Track-allocated Category A work area establishment (initial log entry only)", value: "CATA" },
    { label: "CATB: Track-allocated Category B work area establishment (initial log entry only)", value: "CATB" },
		{ label: "WORK: Non-Track allocated Category A or Category B work area establishment (initial log entry only)", value: "WORK" },
		{ label: "FIRE: Fire incident, non-encampment which affects mainline", value: "FIRE" },
    { label: "MEDPD: Medical incidents requiring employee response and/or BPD", value: "MEDPD" },
		{ label: "NETWRK: Network-related issue", value: "NETWRK" },
    { label: "PSFMP: Program stop failure resulting in cars outside platform, manual procedures authorized", value: "PSFMP" },
    { label: "PSFAER: Program stop failure resulting in cars outside aerial platform, continuing on without station stop", value: "PSFAER" },
    { label: "TRAP: Interlocking trap set incident", value: "TRAP" },
    { label: "COVERBD: Coverboard-related incident", value: "COVERBD" },
    { label: "INSPECT: Required track inspection incident (non-monitored switches, overnight work, etc)", value: "INSPECT" },
    { label: "WHIST: Unscheduled train stop at Yard requested by personnel", value: "WHIST" },
    { label: "MECH: Mechanical equipment incident (ie: car failure)", value: "MECH" },
    { label: "DBLDASH: Double dash incidents", value: "DBLDASH" },
    { label: "BOIP: Brake on in propulsion incidents", value: "BOIP" },
    { label: "FOTF: Miscellaneous FOTF mechanical failure incidents", value: "FOTF" },
    { label: "EM501: Emergency 501 taken by Train Operator", value: "EM501" },
    { label: "GRAFFITI: Graffiti-related incident", value: "GRAFFITI" },
    { label: "TRACK: Wayside anomaly incidents [ie: dip in rail, restricted speed area, cracked rail, switch issue]", value: "TRACK" },
    { label: "EMERG: Emergency incidents [ie: NBC, flooding, high wind, intrusion]", value: "EMERG" },
    { label: "RIDS: RIDS-related incidents", value: "RIDS" },
    { label: "SORS: SORS equipment failures", value: "SORS" },
    { label: "TCD: Track circuit dropout-related incident", value: "TCD" },
    { label: "EMEET: e-BART meet-related incident", value: "EMEET" },
    { label: "GMEET: Grand meet inciden", value: "GMEET" },
    { label: "OAC: Oakland Airport Connector incidents", value: "OAC" },
	],
  //sets amount of characters needed to activate autocomplete list
  minChars: 1,
  //allows the user to choose option with tab key, enter key works as well 
  tabSelect: true,
  //allows the upmost options to be selected with the enter key for faster input
  autoFirst: true,

  //allows for entries to be tags seperated by commas
  //see awesomeplete documentation for deeper understanding, in the future better documentation is needed 
  filter: function(text, input) {
		return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
	},

  item: function(text, input) {
		return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
	},

	replace: function(text) {
		var before = this.input.value.match(/^.+,\s*|/)[0];
		this.input.value = before + text.value + ", ";
	}
   
});

//end of Text autocomplete 

// Text Fomatting - Cleave.js

//initializing cleave.js library to format input text content automatically
//initliazed for input tag labeled "time" in editor.html with id "input-time"
var cleaveTime = new Cleave('.input-time', {
  //sets formatting to time
  time: true,
  //sets formatting to hh:mm could change to timePatter: ['h', 'm', 's'] for hh:mm:ss
  timePattern: ['h', 'm']
});

//initializing cleave.js library to format input text content automatically
//initliazed for input tag labeled "refrence" in editor.html with id "input-ref"
var cleaveRef = new Cleave('.input-ref', {
  //sets formatting to time
  time: true,
  //sets formatting to hh:mm could change to timePatter: ['h', 'm', 's'] for hh:mm:ss
  timePattern: ['h', 'm']
});

//end of Text Formatting

// Function to hide and show text editor form

//internal function to hide and show form with id "editor-form" on editor.html
//works with buttons with id "start-working-day & end-working-day"
function workingDay(endOrStart) {

  //if 1 is inputted into function then our form will be hidden
  if(endOrStart==1)
    //display property allows us to hide an element with none property 
    document.getElementById("editor-form").style.display="none";
  //if anything other then 1 is inputted the our form will return to its normal display property of block
  else
    //block property has an element spread the enter page
    document.getElementById("editor-form").style.display="block";

}

//end of Function to hide and show text editor form