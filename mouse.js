mousepressed = false;
$('html').mouseup(function(eventObject){
    mousepressed = false;
    leadTone.toMaster().triggerRelease();
});

$('html').mousedown(function(eventObject){
    mousepressed = true;
    prevAndCurrentleadNotes = [0,1];

    eventMouse = $.Event('mousemove');
    eventMouse.pageX = eventObject.pageX;
    eventMouse.pageY = eventObject.pageY;

    $('html').trigger(eventMouse);
});

$('html').on('mousemove', function (e) {
    mouseShowHandler(e);
});

leadTone = new Tone.Synth();

max = (verticalKeyboard) ? window.innerHeight : window.innerWidth;

function generateNotesArray(fromOctave, toOctave) {
    notesArray = [];
    for (i=fromOctave; i<toOctave; i++) {
        arr = notesOctave.map(function (t) {
            return t+i;
        });
        notesArray.push(...arr);
    }
    notesArray.push('c'+(toOctave));
    return notesArray;
}
notes = generateNotesArray(fromOctave, toOctave);

countOfSegments = notes.length;
segments = getAllSegments(countOfSegments, max);
segmentLength = max / countOfSegments;

orientationClass =  (verticalKeyboard) ? 'verticalKey' : 'horisontalKey';
if (verticalKeyboard) {
    orientationClass = 'verticalKey';
    param = 'height';
} else {
    orientationClass = 'horisontalKey';
    param = 'width';
}

for (i=0; i < countOfSegments; i++) {
    blackClass = "";
    if(notes[i].indexOf('#') + 1) {
        blackClass = "black";
    }
    noteHtml = '<div class="' + orientationClass + ' ' +blackClass + '" style="' + param + ':' + segmentLength +'px;">' + notes[i] + '</div>';
    $('.notesblock').append(noteHtml)
}

prevAndCurrentleadNotes = [0,1];

function mouseShowHandler(e){
    e = e || window.event;

    if (e.pageX == null && e.clientX != null ) {
        var html = document.documentElement;
        var body = document.body;

        e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
        e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
    }

    mainAxis = (verticalKeyboard) ? e.pageY : e.pageX;
    secondAxis = (verticalKeyboard) ? e.pageX : e.pageY;

    currentSegmentNumber = getCurrentSegmentNumber(segments, mainAxis);
    note = notes[currentSegmentNumber];

    prevAndCurrentleadNotes.push(note);
    prevAndCurrentleadNotes = prevAndCurrentleadNotes.slice(1);

    if (inextricable) {
        if (mousepressed){
            if (inextricableCoeffDependsY) {
                coeff = secondAxis * inextricableCoeff;
            } else {
                coeff = inextricableCoeff;
            }
            leadTone.toMaster().triggerAttack(mainAxis*inextricableCoeff);
        }
    } else {
        if (prevAndCurrentleadNotes[0] == prevAndCurrentleadNotes[1]) {
            return false;
        }

        if (mousepressed){
            leadTone.toMaster().triggerAttack(note);
        }
    }
}

function getCurrentSegmentNumber(segments, xCoord) {
    x = 0;
    for(i in segments) {
        if (segments[i] < xCoord + segmentLength) {
            x = i;
        }
    }
    return x;
}

function getAllSegments(countOfSegments, maxValue) {
    allSegments = [];
    segmentLength = maxValue / countOfSegments;
    value = segmentLength;
    for (i=0; i<countOfSegments; i++) {
        allSegments.push(value);
        value = value + segmentLength;
    }
    return allSegments;
}