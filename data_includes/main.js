PennController.ResetPrefix(null);  // Initiates PennController

var showProgressBar = true;
//var progressBarText = "Fortschritt";

//edit text pop up for voice recording
let replaceConsentMic = ()=>{
        let consentLink = $(".PennController-PennController a.Message-continue-link");
        if (consentLink.length > 0 && consentLink[0].innerHTML.match(/^By clicking this link I understand that I grant this experiment's script access to my recording device/))
            consentLink.html("Durch klicken erteile ich diesem Skript Zugriff auf mein Mikrofon.");
        else
            window.requestAnimationFrame( replaceConsentMic );
};

window.requestAnimationFrame( replaceConsentMic );

const replacePreloadingMessage = ()=>{
    const preloadingMessage = $(".PennController-PennController > div");
    if (preloadingMessage.length > 0 && preloadingMessage[0].innerHTML.match(/^<p>Please wait while the resources are preloading/))
        preloadingMessage.html("<p>Laden, bitte warten</p>");
    window.requestAnimationFrame( replacePreloadingMessage );
};
window.requestAnimationFrame( replacePreloadingMessage );

const replaceUploadingMessage = ()=>{
    const uploadingMessage = $(".PennController-PennController > p");
    if (uploadingMessage.length > 0 && uploadingMessage[0].innerHTML.match(/^Please wait while the archive of your recordings is being uploaded to the server/))
        uploadingMessage.html("Bitte warten Sie, bis das Archiv Ihrer Aufnahmen auf den Server hochgeladen wurde. Dies kann einige Minuten dauern.");
    window.requestAnimationFrame( replaceUploadingMessage );
};
window.requestAnimationFrame( replaceUploadingMessage );


// Show the 'intro' trial first, then all the 'experiment' trials in a random order
// then send the results and finally show the trial labeled 'bye'


Sequence("cogtask",
  "intro_ID",
"consent_form",
"initiate_recorder",
"audio_check",
"questionnaire",

"instruct_1_1_day2_cognitivetask1",
randomize ("category"),
//"instruct_1_1_day2_cognitivetask2",
//randomize ("spantask"),

"send",
"final");

//start the recorder and send result files to the server

Template (
  cogtask =>
  newTrial("cogtask",
      defaultText
          .print()
      ,
      newHtml("cogtask", "ospantask.html")
              //.checkboxWarning("It is highly recommended that you check the '%name%' box before continuing")
              //.radioWarning("Please consider selecting an option for '%name%'")
              //.inputWarning("We would like you to type some text in these fields")
              .print()
      ,
      newButton("I have completed the form")
             .print()
             .wait()
             .remove()
      ,
      getHtml("cogtask")
             .warn()
      ,
      newKey("space", " ")
             .log()
             .wait()
)
);


Template (
  cogtask_sample =>
  newTrial("cogtask_sample",
      defaultText
          .print()
        ,
        newText("<p><a href='https://hyein-jeong.github.io/cognitivetask/german/operation_span_web_german.html'>Click here to continue to the second cognitive task.</a></p>")
          .print()
        ,
        newKey("space", " ")
        	.log()
          .wait()
)
);


Template(GetTable("intro_recorder.csv"),
    ir =>
    InitiateRecorder("https://uni-potsdam.de/phraseproduction/exp2/upload-recording.php", ir.line1)
        .label("initiate_recorder")
)

Template(GetTable("intro_ID.csv"),
    iid =>
    newTrial("intro_ID",
        defaultText
            .print()
        ,
        newText("instr_1", iid.line1)
            .css("text-decoration","underline")
            .print()
        ,
        newButton("instr_button", "Fortfahren")
            .center()
            .size(100, 30)
            .css("border", "solid 5px white")
            .print()
            .wait()
    )
);

Template(GetTable("consent_form.csv"),
    cf =>
    newTrial("consent_form",
        defaultText
            .print()
        ,
        newText("line1", cf.line1)
            .css("border", "solid 2px white")
        ,
        newCanvas("consent_canvas", 800, 400)
            .add(0, 0, getText("line1"))
            .print()
        ,
        newButton("Ich stimme zu.")
            .print()
            .center()
            .log()
            .wait()
    )
);

Template(GetTable("questionnaire.csv"),
    qu =>
    newTrial("questionnaire",
        defaultText
            .print()
        ,
        newText("line1", qu.line1)
            .css("border", "solid 10px white")
	    .css("background", "white")
        ,
        newTextInput("Gender")
            .size(100, 20)
            .log()
        ,
        newText("line2", qu.line2)
            .after(getTextInput("Gender"))
            .print()
        ,
        newDropDown("Age", "--")
            .add("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100+")
            .print()
            .log()
        ,
        newText("line3", qu.line3)
            .after(getDropDown("Age"))
            .print()
        ,
        newTextInput("Prolific_ID")
            .size(100, 20)
            .log()
        ,
        newText("line8", qu.line8)
            .after(getTextInput("Prolific_ID"))
            .print()
        ,
        newVar("ID")
            .global()
            .set(getTextInput("Prolific_ID") )
            .log()
        ,
        newButton("qu_test_button", "Fortfahren in den Vollbildmodus.")
            .print()
            .wait(
                getTextInput("Gender")
                .test.text(/[^ ]+/)
                )
            ,
            fullscreen()
    ).log( "ID" , getVar("ID") )
);

Template(GetTable("audio_check.csv"),
    ac =>
    newTrial("audio_check",
        defaultText
            .print()
        ,
        newText("line1", ac.line1)
	     .bold()
	     .css("background", "white")
        ,
        newText("line2", ac.line2)
        ,
        newText("line3", ac.line3)
        ,
        newText("line4", ac.line4)
	     .css("background", "white")
        ,
        newText("line5", ac.line5)
	     .css("background", "white")
        ,
        newText("line6", ac.line6)
	     .css("background", "white")
	,
        newText("line7", ac.line7)
 	     .css("background", "white")
	,
        newMediaRecorder("ac_recorder", "audio")
            .center()
            .print()
	    .css( "border" , "solid 3px red" )
        ,
        newText("line8", ac.line8)
            .css("border", "solid 2px white")
        ,
        newButton("ac_test_button", "Fortfahren")
            .center()
            .size(100, 30)
            .css("border", "solid 5px white")
            .print()
            .wait(getMediaRecorder("ac_recorder").test.recorded())
    )
);

newTrial("instruct_1_1_day2_cognitivetask1",
    defaultText
        .print()
    ,
    newImage("pic_instruct_1_1_day2_cognitivetask1", "instruct_1_1_day2_cognitivetask1.png")
        .size(1280, 720)
        .print()
    ,
    newKey("space", " ")
	.log()
        .wait()
);

////////////////////////////////////  templates for category fluency task
Template(GetTable("category.csv"),
    ct =>
    newTrial("category",
        defaultText
            .print()
    ,
    newMediaRecorder("category_recorder", "audio")
        .hidden()
        .record()
        .log()   
    ,
    newText("category_name", ct .line1)
        .css("background", "white")
        .center()
        .bold()
        .print()
        .log()
    ,
    newTimer("category_trial", 50000)
        .start()
        .wait()
        .log()
    ,
    getText("category_name")
        .remove()
    ,
    newTimer("post_trial", 200)
        .start()
        .wait()
        .log()
    ,
    getMediaRecorder("category_recorder")
        .stop()
        .remove()
        .log()

).log( "category", ct.line1 )
);


Template(GetTable("feedback.csv"),
    fb =>
        newTrial("comment",
            newText(fb.line1)
                .print()
            ,
	    newText(fb.line2)
                .print()
            ,
	    newTextInput("feedback")
                .settings.size(400, 50)
                .css("border", "solid 2px grey")
                .settings.log()
                .print()
            ,
	    newText(fb.line9)
                .print()
            ,
	    newTextInput("feedback")
                .settings.size(400, 50)
                .css("border", "solid 2px grey")
                .settings.log()
                .print()
            ,
            newButton("comment_end_button", "Fortfahren")
                .css("border", "solid 5px white")
                .print()
                .wait()
        )
)



SendResults("send");

Template(GetTable("final_test.csv"),
    fin =>
        newTrial("final",
            exitFullscreen()
            ,
            newText(fin.line1)
                .print()
            ,
            newButton("void")
                .wait()
        )
);

newTrial("final_sample",
    newText("<p>Thank you for your participation!</p>")
        .print()
    ,
    newText("<p><a href='https://www.pcibex.net/'>Click here to validate your participation.</a></p>")
        .print()
    ,
    newButton("void")
        .wait()
);
