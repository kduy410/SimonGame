// @ts-nocheck
var buttonColours = ['red', 'blue', 'green', 'yellow'];

var gamePattern = [];
var userClickedPattern = [];

var level = 0;
var started = false;
var gameOver = false;
var inCD = false;

var gameLatency = [250, 125, 75, 50, 25, 10];
var levelLatency = gameLatency[0];

function playSound(name) {
    var audio = new Audio('sounds/' + name + '.mp3');
    var resp = audio.play();
    if (resp != undefined) {
        resp.then(_ => {
            // autoplay starts!
        }).catch(e => {
            console.log(e);
        });
    }
}

function flash(name) {
    $("#" + name).fadeIn(100).fadeOut(100).fadeIn(100);
}

function animatePress(currentColour) {
    $('#' + currentColour).addClass('pressed').delay(100).queue(function () {
        $(this).removeClass('pressed').dequeue();
    });
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
    gameOver = false;

    $('#level-title').text('Press A Key to Start');
}

function nextSequence() {
    gamePattern = [];
    userClickedPattern = [];
    level++;
    inCD = true;

    levelLatency = checkLevel();
    console.log(levelLatency);

    for (let i = 0; i < 3; i++) {
        (function (i) {
            setTimeout(function () {
                $("#level-title").text("Level " + level + " in " + (3 - i) + "s");
            }, 1000 * i);
        }(i));
    }

    setTimeout(function () {
        for (let i = 0; i < level; i++) {
            (function (i) {
                setTimeout(function () {
                    var randomNumber = Math.floor(Math.random() * 4);
                    var randomChosenColour = buttonColours[randomNumber];
                    gamePattern.push(randomChosenColour);
                    flash(randomChosenColour);
                    playSound(randomChosenColour);
                    if (level === i + 1) {
                        inCD = false;
                        console.log(gamePattern);
                    }
                }, levelLatency * i * level)
            }(i));
        }
        $("#level-title").text("Level " + level);
    }, 3000);
}

function checkSequence(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            $("#level-title").text("You're RIGHT!");
            inCD = true;
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
        console.log(userClickedPattern);
    } else {
        gameOver = true;

        playSound('wrong');
        $("#level-title").text("WRONGGG!");
        setTimeout(function () {
            $("#level-title").text("Game Over, Press Any Key to Restart");
        }, 1000);
        $('body').addClass('game-over').delay(200).queue(function () {
            $(this).removeClass('game-over').dequeue();
        });
    }
}

function checkLevel(){
    var index = Math.floor(level/10);
    var count = gameLatency.length;
    return index > count ? gameLatency[count - 1] : gameLatency[index];
}

$(".btn").click(function () {
    if (gameOver || !started || inCD) {
        return;
    }

    var userChosenColour = $(this).attr('id');
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkSequence(userClickedPattern.length - 1);
});

$(document).keypress(function (event) {
    if (!started && (event.key === 'a' || event.key === 'A')) {
        nextSequence();
        started = true;
    } else if (gameOver && event.key) {
        startOver();
    }
})