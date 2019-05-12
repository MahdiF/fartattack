chrome.runtime.onMessage.addListener(gotMessage);

// Default settings
let settings = {
    trackHover: false,
    trackClick: true,
    trackButtons: true,
    coverIcon: false,
    newTab: true
}


// Load settings from Chrome Storage
chrome.storage.sync.get(['fartAttackSettings'], function(result) {
    if (result.fartAttackSettings) {
        settings = result.fartAttackSettings;
        console.log('🍑💨 Fart Attack settings loaded from Chrome storage');
        console.log(settings);
        initiateOperationFart();
    }
});

function gotMessage(message, sender, sendResponse) {
    settings = message;
}




// Operation Fart
let
    sounds = [
        '204844',
        '204849',
        '204918',
        '204959',
        '205008',
        '205021',
        '205026',
        '205033',
        '205044',
        '205053',
        '205102',
        '205106'
    ],
    links,
    buttons,
    players,
    lastPlayed
;


function trackElements(elementName, elementTag) {
    elementName = Array.prototype.slice.call(document.querySelectorAll(elementTag));
    elementName.forEach(element => {
        if (settings.trackClick) {
            element.addEventListener('click', () => {
                playRandomSound();
            });
        }
        if (settings.trackHover) {
            element.addEventListener('mouseenter', () => {
                playRandomSound();
            });
            element.addEventListener('mouseleave', () => {
                stopSound(lastPlayed);
            });
            element.addEventListener('touchmove', () => {
                stopSound(lastPlayed);
            });
        }
        
        // Make sure links open in a new window
        if (settings.newTab) {
            element.setAttribute('target', '_blank');
        }
        
    });
}



function generateAudioPlayer(src) {
    let
        audioPlayer = document.createElement('audio'),
        mp3Source = document.createElement('source'),
        oggSource = document.createElement('source'),
        mp3Location = chrome.extension.getURL('sounds/mp3/' + src + '.mp3'),
        oggLocation = chrome.extension.getURL('sounds/ogg/' + src + '.ogg')
    ;

    // Set attributes
    audioPlayer.setAttribute('preload', true);
    audioPlayer.style.display = 'none';
    mp3Source.setAttribute('type', 'audio/mpeg');
    oggSource.setAttribute('type','audio/ogg');
    mp3Source.setAttribute('src', mp3Location);
    oggSource.setAttribute('src', oggLocation);

    
    // Catch errors
    mp3Source.addEventListener('error', function(){
        console.error('😶 D\'oh! The mp3 file ' + mp3Source.src + ' is wrong!');
    });
    oggSource.addEventListener('error', function(){
        console.error('😶 D\'oh! The ogg file ' + oggSource.src + ' is wrong!');
    });

    // appending the sources to the player element
    audioPlayer.appendChild(mp3Source);
    audioPlayer.appendChild(oggSource);
    
    // Append player to page
    document.body.appendChild(audioPlayer);

    audioPlayer.controls = false; // Hide player
    
    audioPlayer.load(); // Load audio when it's updated   
}

function playSound(player) {
    if (player) {
        // check if play head is not at 0 and reset it
        if (player.currentTime !== 0) {
            player.currentTime = 0;
        }
        player.play();
    }
}

function stopSound(player) {
     // check if player exists, the check if the sound already played before stopping it
    if (player && player.currentTime !== 0) {
        player.pause();
        player.currentTime = 0; // reset to beginning
    }
}


function randomNum(min, max) {
    return Math.floor( Math.random()  * (max - min + 1) ) + min;
}

function addPlayers() {
    sounds.forEach(sound => {
        generateAudioPlayer(sound);
    });
    players = Array.prototype.slice.call(document.querySelectorAll('audio'));
}


function playRandomSound() {
    let num = randomNum(0, players.length - 1);
    let player = players[num];
    playSound(player);
    lastPlayed = player; // Register last played player
}


function initiateOperationFart() {
    addPlayers();
    trackElements('links', 'a');
    if (settings.trackButtons) {
        trackElements('buttons', 'button');
    }
    
}

