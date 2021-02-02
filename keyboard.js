playingNow = [];
function playChord(chordName, octave=4) {
    chord = chords[chordName];
    playingNow = [];
    if(spacepressed) {
        chord = sharpChord(chordName);
    }

    for (note in chord) {
        tone = new Tone.Synth();
        //Если нота сейчас не проигрывается
        if (playingNow.length > 0) {
            if (playingNow.find(x => x.noteName === note)) {
                return false;
            }
        }
        tone.toMaster().triggerAttack(chord[note] + octave);
        playingNow.push({'noteName': chord[note], 'toneObject': tone});
    }
}

spacepressed = false;
$('html').keyup(function(eventObject){
    if (eventObject.keyCode == keysCodes['space']) {
        spacepressed = false;
    }
});

$('html').keydown(function(eventObject){
    if (eventObject.keyCode == keysCodes['space']) {
        spacepressed = true;
    }
});

var keysdown = {};
$('html').keyup(function(eventObject){
    prevAndCurrentKeys = [0, 1];
    prevKey = eventObject.keyCode;
    keysdown[event.keyCode] = false;
    if (playingNow !== undefined && playingNow.length > 0) {
        for (tone in playingNow) {
            playingNow[tone]['toneObject'].triggerRelease();
        }
    }
});

prevAndCurrentKeys = [0, 1]; //должно быть различие между первым и вторым елементом
$('html').keydown(function(eventObject){ //отлавливаем нажатие клавиш
    prevAndCurrentKeys.push(eventObject.key);
    prevAndCurrentKeys = prevAndCurrentKeys.slice(1);

    if (prevAndCurrentKeys[0] == prevAndCurrentKeys[1]) {
        return false;
    }

    keysdown[event.keyCode] = true;
    key = keyboardMap[event.keyCode];
    chordName = key;
    if (event.shiftKey) {
        chordName = key + 'm';
    }

    if (playingNow !== undefined && playingNow.length > 0) {
        for (tone in playingNow) {
            playingNow[tone]['toneObject'].triggerRelease();
        }
    }

    playChord(chordName);
});

function sharpChord(chordName) {
    chord = chords[chordName];
    sharpedChord = [];
    for (note in chord) {
        sharpedChord.push(noteSharpTable[chord[note]]);
    }
    return sharpedChord;
}