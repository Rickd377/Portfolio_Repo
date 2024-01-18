let player1 = { "position": 1, "wins": 0 };
let player2 = { "position": 1, "wins": 0 };
let player1Turn = true;


setTimeout(function () {
    let naam = prompt("What is your name?");
    document.getElementById("ownname").innerHTML = naam + ":";
}, 1000);

function dice() {
    let number = Math.random() * 6;
    number = Math.floor(number) + 1;
    return number;
}
document.getElementById("placeholder").innerHTML = dice();

function roll(player) {
    let score = dice();
    document.getElementById("placeholder").innerHTML = score;
    hidePlayer();
    player["position"] += score;
    if (player["position"] > 63) {
        player["position"] = 64;
    }
    if (player["position"] < 1) {
        player["position"] = 1;
    }
    showPlayer();
}

function special(player, otherPlayer) {
    let bridge = [3, 15, 22, 42]
    let dice = [8, 20, 33, 58]
    let joker = [10, 23, 52]
    let allIn = [18, 48]
    let blut = [25, 50]
    let jackpot = [31, 38, 55]

    if (bridge.includes(player["position"])) {
        hidePlayer();
        player["position"] += 4;
        if (player["position"] >= 63) {
            player["position"] = 64;
        }
        showPlayer();
    } else if (dice.includes(player["position"])) {
        roll(player);
        if (player === player1) {
            alert("Throw again");
        } else if (player === player2) {
            alert("Bot throws again");
        }
    } else if (joker.includes(player["position"])) {
        hidePlayer();
        player["position"] -= 3;
        if (player["position"] < 1) {
            player["position"] = 1;
        }
        showPlayer();
        setTimeout(function () {
            special(player)
        }, 2000);
    } else if (allIn.includes(player["position"])) {
        hidePlayer();
        player["position"] = 1;
        showPlayer();
    } else if (blut.includes(player["position"])) {
        hidePlayer();
        player["position"] = 16;
        showPlayer();
    } else if (jackpot.includes(player["position"])) {
        hidePlayer();
        otherPlayer["position"] -= 5;
        if (otherPlayer["position"] < 1) {
            otherPlayer["position"] = 1;
        }
        showPlayer();
    }
}

function turnManager() {
    let currentPlayer = player1Turn ? player1 : player2;
    let otherPlayer = player1Turn ? player2 : player1;
    console.log(currentPlayer);
    if (currentPlayer != player1) {
        roll(currentPlayer);
    } else {
        alert("Roll the dice!!!");
        roll(currentPlayer);
    }

    if (currentPlayer["position"] >= 64) {
        alert("Game over! Player " + (player1Turn ? "1" : "bot") + " wins!");
        currentPlayer["wins"] += 1;
        saveCookies();
        updateHighscore();
        return;
    }



    setTimeout(function () {
        special(currentPlayer, otherPlayer);
    }, 1000);


    player1Turn = !player1Turn;
    setTimeout(function () {
        turnManager();
    }, 1500);
}


function botTurn() {
    console.log("bot turn")
    player1Turn = false;
}

function startGame() {
    showPlayer();
    turnManager();
    updateHighscore();
}

function refreshPage() {
    window.location.reload();
}

function showPlayer() {
    document.querySelector(`div.vakje${player1["position"]}>div>img.player1image`).style.zIndex = "1";
    document.querySelector(`div.vakje${player2["position"]}>div>img.player2image`).style.zIndex = "1";
}

function hidePlayer() {
    document.querySelector(`div.vakje${player1["position"]}>div>img.player1image`).style.zIndex = "-1";
    document.querySelector(`div.vakje${player2["position"]}>div>img.player2image`).style.zIndex = "-1";
}


function updateHighscore() {
    let cookieRead = getCookies();
    player1["wins"] = cookieRead["player1"];
    player2["wins"] = cookieRead["player2"];
    let highscore1 = document.getElementById("player1Highscore");
    let highscore2 = document.getElementById("player2Highscore");
    highscore1.innerHTML = player1["wins"];
    highscore2.innerHTML = player2["wins"];
}


function getCookies() {
    let cookie = document.cookie;
    let cookieArray = cookie.split(";");
    if (!cookie.includes("player1") || !cookie.includes("player2")) {
        return { "player1": 0, "player2": 0 };
    }
    let cookieObject = {};
    for (let i = 0; i < cookieArray.length; i++) {
        let keyValue = cookieArray[i].split("=");
        cookieObject[keyValue[0].trim()] = parseInt(keyValue[1].trim());
    }
    return cookieObject;

}

function saveCookies() {
    let cookieObject = getCookies();
    cookieObject["player1"] = player1["wins"];
    cookieObject["player2"] = player2["wins"];
    const d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    let cookieString = "player1=" + cookieObject["player1"] + ";" + expires + ";path=/";
    let cookieString2 = "player2=" + cookieObject["player2"] + ";" + expires + ";path=/";
    document.cookie = cookieString;
    document.cookie = cookieString2;
}

function resetCookies() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=0;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    }
}