"use strict";

// Creating player class

class Player {
  constructor(playerName, $nameSection, $scoreSection) {
    this.name = playerName;
    this.score = 0;
    this.$nameDOM = $nameSection;
    this.$scoreDOM = $scoreSection;
  }
  UpdatePlayerDOM() {
    this.$nameDOM.text(this.name);
    this.$scoreDOM.text(this.score);
  }
}
// Animal images object
const animalImages = {
  bat: "../images/animals/bat.jpg",
  bear: "../images/animals/bear.jpg",
  beetle: "../images/animals/beetle.jpg",
  boaConstrictor: "../images/animals/boaConstrictor.jpg",
  buffalo: "../images/animals/buffalo.jpg",
  capybara: "../images/animals/capybara.jpg",
  cat: "../images/animals/cat.jpg",
  catfish: "../images/animals/catfish.jpg",
  cheetah: "../images/animals/cheetah.jpg",
  crocodile: "../images/animals/crocodile.jpg",
  eel: "../images/animals/eel.jpg",
  elephant: "../images/animals/elephant.jpg",
  emu: "../images/animals/emu.jpg",
  fox: "../images/animals/fox.jpg",
  frog: "../images/animals/frog.jpg",
  gazelle: "../images/animals/gazelle.jpg",
  giraffe: "../images/animals/giraffe.jpg",
  gorilla: "../images/animals/gorilla.jpg",
  hare: "../images/animals/hare.jpg",
  hippo: "../images/animals/hippo.jpg",
  hyena: "../images/animals/hyena.jpg",
  koala: "../images/animals/koala.jpg",
  leopard: "../images/animals/leopard.jpg",
  lion: "../images/animals/lion.jpg",
  meerkat: "../images/animals/meerkat.jpg",
  monitorLizard: "../images/animals/monitorLizard.jpg",
  parrot: "../images/animals/parrot.jpg",
  raccoon: "../images/animals/raccoon.jpg",
  raven: "../images/animals/raven.jpg",
  rhino: "../images/animals/rhino.jpg",
  snake: "../images/animals/snake.jpg",
  spider: "../images/animals/spider.jpg",
  spoonbill: "../images/animals/spoonbill.jpg",
  tarsier: "../images/animals/tarsier.jpg",
  tiger: "../images/animals/tiger.jpg",
  turtle: "../images/animals/turtle.jpg",
  vulture: "../images/animals/vulture.jpg",
  warthog: "../images/animals/warthog.jpg",
  wildebeest: "../images/animals/wildebeest.jpg",
  wolf: "../images/animals/wolf.jpg",
  baboon: "../images/animals/baboon.jpg",
  GetRandAnimals: function (numAnimals) {
    const randAnimals = [];
    // Store all properties in an array
    const allPropertyNames = Object.keys(animalImages);
    // Remove Functions from the above array to store all animalNames
    const allAnimalNames = allPropertyNames.filter((propertyName) => {
      return typeof animalImages[propertyName] !== "function";
    });
    // Shuffle this array
    this.ShuffleAllAnimalNames(allAnimalNames);
    // Return first numAnimals animals's names and image links
    for (let i = 0; i < numAnimals; i++) {
      randAnimals[i] = allAnimalNames[i];
    }
    return randAnimals;
  },
  ShuffleAllAnimalNames: function (allAnimalNames) {
    for (let i = allAnimalNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnimalNames[i], allAnimalNames[j]] = [
        allAnimalNames[j],
        allAnimalNames[i],
      ];
    }
  },
};
// Creating tile grid class
class TileGrid {
  constructor(size, difficulty) {
    this.rows = size;
    this.columns = size;
    this.numTiles = 0;
    this.difficulty = difficulty;
    this.gridID = "tile-grid";
    this.$grid = $(document.createElement("table")).attr("id", this.gridID);
    this.animals = {};
    this.numTilesFlipped = 0;
    this.prevFlippedTileNum = null;
    this.prevFlippedAnimal = null;
    this.allowClick = true;
    this.tilesSolved = 0;
  }
  AddGrid(screen) {
    let cellNum = 1;
    // variable to adjust cell dimensions based on grid size
    let dim = this.GetCellDim();
    for (let i = 1; i <= this.rows; i++) {
      // Create row i
      const $row = $(document.createElement("tr")).attr("id", `grid-row-${i}`);
      // append row number i
      $(this.$grid).append($row);
      // Within row number i append cells
      for (let j = 1; j <= this.columns; j++) {
        // Create cell number cellNum
        const $cell = $(document.createElement("td"))
          .attr("id", `cell-${cellNum}`)
          .attr("class", "cell unflipped-cell")
          .css({ width: dim, height: dim });
        $($row).append($cell);
        cellNum++;
      }
    }
    $(`#${screen}`).append(this.$grid);
    // Add animals to the tiles
    this.AddAnimals();
  }
  RemoveGrid(screen) {
    $(`#${screen}`).remove(`#${this.gridID}`);
  }
  AddAnimals() {
    // Declare an object to store the index (1-indexed) of cell /
    // tile and store animal name in flipped state
    let flippedAnimals = {};
    // If numTiles odd then we need a joker tile
    let jokerTileIndex = 0;
    // Get total number of tiles
    this.numTiles = this.rows * this.columns;
    // Check if number of tiles is even or odd
    let isOdd = this.numTiles % 2 == 1 ? true : false;
    // Calculate num animals; one tile will be joker's if numTiles is odd
    let numAnimals = isOdd ? (this.numTiles - 1) / 2 : this.numTiles / 2;
    //Get list of random animals
    let animals = animalImages.GetRandAnimals(numAnimals);
    //If numTiles is odd select a joker
    if (isOdd) {
      jokerTileIndex = 1 + Math.floor(Math.random() * this.numTiles);
      this.animals[jokerTileIndex] = "joker";
    }
    // Create an array of cell / tile indices and shuffle them
    let indices = [];
    for (let i = 1; i <= this.numTiles; i++) {
      if (i === jokerTileIndex) {
        continue;
      } else {
        indices.push(i);
      }
    }
    this.ShuffleCellIndices(indices);
    // Attach every index to an animal
    for (let i = 0; i < animals.length; i++) {
      this.animals[indices[2 * i]] = animals[i];
      this.animals[indices[2 * i + 1]] = animals[i];
    }
    // Repeat Pairs based on difficulty level
    if (this.difficulty == "Easy") {
      this.RepeatPairs(Math.floor(this.rows / 2) + 1);
    } else if (this.difficulty == "Medium") {
      this.RepeatPairs(Math.floor(this.rows / 2));
    }
  }
  // Function that repeats animals based on the difficulty of game
  RepeatPairs(repeatPairs) {
    // Get all paired indices
    let pairs = this.IdentifyPairs();
    for (let i = 0; i < repeatPairs; i++) {
      // Store all animals in an array
      const animalsArr = Object.keys(pairs);
      // Select a random animal from pairs
      let firstRandAnimal =
        animalsArr[Math.floor(Math.random() * animalsArr.length)];
      // Select another random animal from pairs
      let secondRandAnimal =
        animalsArr[Math.floor(Math.random() * animalsArr.length)];
      // Ensure they aren't the same
      while (firstRandAnimal === secondRandAnimal) {
        secondRandAnimal =
          animalsArr[Math.floor(Math.random() * animalsArr.length)];
      }
      // Set indices of second animal's pair to first animal in the this.animals object
      this.animals[pairs[secondRandAnimal][0]] = firstRandAnimal;
      this.animals[pairs[secondRandAnimal][1]] = firstRandAnimal;
      // Remove both animals from pairs
      delete pairs[firstRandAnimal];
      delete pairs[secondRandAnimal];
    }
  }
  // Get all paired indices
  IdentifyPairs() {
    const pairs = {};
    for (let index in this.animals) {
      let animal = this.animals[index];
      // Skip joker
      if (animal === "joker") {
        continue;
      }
      if (pairs[animal] === undefined) {
        pairs[animal] = [index];
      } else {
        pairs[animal].push(index);
      }
    }
    return pairs;
  }
  // Function to flip tile
  FlipTile(tileNum, animal) {
    let imgUrl =
      animal === "joker" ? "../images/joker.jpg" : animalImages[animal];
    $(`#cell-${tileNum}`)
      .removeClass("unflipped-cell")
      .addClass("flipped-cell")
      .css({ "background-image": `url("${imgUrl}")` });
  }
  UnflipTile(tileNum) {
    $(`#cell-${tileNum}`)
      .removeClass("flipped-cell")
      .addClass("unflipped-cell")
      .css({ "background-image": "url(../images/UnflippedTileBg.png)" });
  }
  HideTile(tileNum) {
    $(`#cell-${tileNum}`)
      .removeClass("flipped-cell")
      .removeClass("unflipped-cell")
      .removeClass("cell")
      .addClass("hidden-cell")
      .css({ "background-image": "none" });
  }
  GetCellDim() {
    // Object to store size to dim mapping
    const sizeToDimMap = {
      3: "14.5rem",
      4: "11rem",
      5: "8.5rem",
      6: "7rem",
      7: "6rem",
      8: "5.2rem",
      9: "4.6rem",
    };
    // return dimensions
    return sizeToDimMap[this.rows];
  }
  ShuffleCellIndices(indices) {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }
}
// Declaring and initlialising game object
const game = {
  title: "snapimals",
  activeScreen: "intro-screen",
  isRunning: false,
  numPlayers: 1,
  players: [],
  activePlayer: null,
  winnerPlayer: null,
  gridSize: null,
  isTimed: null,
  difficulty: null,
  timePerTurn: null,
  timeRemaining: null,
  timerId: null,
  tileGrid: null,
  typeWriterInterval: 50,
  audioContext: null,
  gainNode: null,
  gameSounds: {
    theme: { path: "../audio/safari.mp3", source: null },
    flip: { path: "../audio/flip.wav", source: null },
    solve: { path: "../audio/solve.mp3", source: null },
    joker: { path: "../audio/joker.mp3", source: null },
  },
  domPlaybtn: $("#play-btn"),
  domPausebtn: $("#pause-btn"),
  domStopbtn: $("#stop-btn"),
  domClock: $("#clock"),
  domSoundbtn: $("#sound-btn"),
  domPauseOverLay: $("#pause-overlay"),
  SwitchScreen: function (newScreen) {
    $(`#${newScreen}`)
      .removeClass("dormant-screen")
      .addClass("active-screen")
      .siblings()
      .addClass("dormant-screen")
      .removeClass("active-screen");
    this.activeScreen = newScreen;
    // Invoke game function depending on active-screen
    if (this.activeScreen == "setup-screen-1") {
      this.SetupPlayer1();
    }
    if (this.activeScreen == "setup-screen-2") {
      this.SetupNumPlayers();
    }
    if (this.activeScreen == "setup-screen-3") {
      this.SetupOtherPlayers();
    }
    if (this.activeScreen == "setup-screen-4") {
      this.SetupGame();
    }
    if (this.activeScreen == "game-screen") {
      this.SetupGameBoard();
    }
    if (this.activeScreen == "game-over-screen") {
    }
  },
  ToggleRunning: function () { },
  Init: function () {
    const introText = `Welcome, Explorer! Embark on a memory safari to match captivating creatures in this uncharted wilderness. Get ready, the adventure starts now!`;
    // Add event listener to skip-btn to skip-text
    game.ActivateSkip();
    // Invoke the typewriter effect function
    this.TypeWriter(introText, "intro-para", 0, () => {
      // Add a button to indicate that the player can move on to setup screen
      $("#splash-screen").append(
        `<button type="button" class="btn btn-warning btn-lg box-shadow--10d continue-btns" id = "continue-btn">c o n t i n u e !</button>`
      );
      // Add event listener to continue-btn to move to next screen
      $("#continue-btn").on("click", () => game.SwitchScreen("setup-screen-1"));
    });
    // Add audio context and event handler to sound-btn
    game.ManageSound();
  },
  SetupPlayer1: function () {
    const namePrompt = `Hello Explorer!
        What's your name!`;
    // Add event listener to skip-btn to skip-text
    game.ActivateSkip();
    // Invoke the typewriter effect function
    this.TypeWriter(namePrompt, "name-prompt", 0, () => {
      // Add a form for player1 name
      const form = game.CreateNameForm(1);
      $("#setup-screen-1").append(form);
      // Add event listener to form-submit-btn to create player and move to next screen
      $("#player-1-name-submit").on("click", () => {
        const playerName = $("#player-1-name-input").val().trim();
        if (playerName == "") {
          alert("Please enter a valid name!");
        } else {
          game.AddPlayer(playerName);
          game.SwitchScreen("setup-screen-2");
        }
      });
    });
  },
  SetupNumPlayers: function () {
    const numPlayersPrompt = `Hello ${game.players[0].name}!
        Are you alone or do you have other explorers with you?`;
    // Add event listener to skip-btn to skip-text
    game.ActivateSkip();
    // Invoke the typewriter effect function
    this.TypeWriter(numPlayersPrompt, "num-players-prompt", 0, () => {
      // Add options for numplayers
      $("#num-players-options").append(
        `<button type="button" class="btn btn-warning btn-lg box-shadow--10d num-players continue-btns" id="1-player">&nbspThere is just me!</button>`
      );
      $("#num-players-options").append(
        `<button type="button" class="btn btn-warning btn-lg box-shadow--10d num-players continue-btns" id="2-player">There are 2 of us!</button>`
      );
      $("#num-players-options").append(
        `<button type="button" class="btn btn-warning btn-lg box-shadow--10d num-players continue-btns" id="3-player">There are 3 of us!</button>`
      );
      $("#num-players-options").append(
        `<button type="button" class="btn btn-warning btn-lg box-shadow--10d num-players continue-btns" id="4-player">There are 4 of us!</button>`
      );
      // Add event listeners to form-submit-btn to create player and move to next screen
      $(".num-players").on("click", (event) => {
        // Use event-target because this.attr will not work within the click event handler
        game.numPlayers = Number($(event.target).attr("id")[0]);
        //Move to the next screen
        if (game.numPlayers == 1) {
          game.SwitchScreen("setup-screen-4");
        } else {
          game.SwitchScreen("setup-screen-3");
        }
      });
    });
  },
  SetupOtherPlayers: function () {
    // Create prompt based on number of players
    const namesPrompt =
      game.numPlayers === 2
        ? `Good ${game.CurrTime()} ${game.players[0].name
        } and the other explorer! May I know your name?`
        : `Good ${game.CurrTime()} ${game.players[0].name
        } and the other explorers! May I know your names?`;
    // Add event listener to skip-btn to skip-text
    game.ActivateSkip();
    // Invoke the typewriter effect function to Read prompt and display name forms
    this.TypeWriter(namesPrompt, "player-names-prompt", 0, () => {
      // Create and display form
      const form = game.CreateNameForm(game.numPlayers - 1);
      $("#setup-screen-3").append(form);
      // Add event listener to the continue button
      $("#other-players-name-submit").on("click", () => {
        const playerNames = [
          game.players[0].name,
          $("#player-2-name-input").val().trim(),
        ];
        $("#player-2-name-input")
          .siblings()
          .each(function () {
            playerNames.push($(this).val().trim());
          });
        if (playerNames.includes("")) {
          alert("Please enter valid names!");
        } else {
          for (let i = 1; i < playerNames.length; i++) {
            game.AddPlayer(playerNames[i]);
          }
          game.SwitchScreen("setup-screen-4");
        }
      });
    });
  },
  SetupGame: function () {
    // Create prompt based on number of players
    const setupPrompt =
      game.numPlayers === 1
        ? `Welcome again ${game.players[0].name}! It's time to set your game up. Click on more info to help you decide.`
        : `Welcome again Explorers! It's time to set your game up. Click on more info to help you decide.`;
    // Add event listener to skip-btn to skip-text
    game.ActivateSkip();
    // Invoke the typewriter effect function to Read prompt and setup form
    game.TypeWriter(setupPrompt, "setup-prompt", 0, () => {
      const form = game.CreateSetupForm();
      $("#setup-screen-4")
        .append(form)
        .append(
          `<button type="button" class="btn btn-warning continue-btns" id = "game-setup-submit">c o n t i n u e !</button>`
        );
      // Add event listener to continue button
      $("#game-setup-submit").on("click", () => {
        // Store game settings form selections in corresponding game properties
        game.gridSize = $("#grid-selection").find(":selected").text();
        game.isTimed =
          $("#mode-selection").find(":selected").text() == "Standard"
            ? false
            : true;
        game.difficulty = $("#difficulty-selection").find(":selected").text();
        // Move to game board
        game.SwitchScreen("game-screen");
        // Make Player-1 as active
        game.activePlayer = game.players[0];
        game.HighlightActivePlayer();
        // If time game then Start Timer
        if (game.isTimed) {
          if (game.difficulty === "Easy") {
            game.timePerTurn = 10000;
          } else if (game.difficulty === "Medium") {
            game.timePerTurn = 7000;
          } else {
            game.timePerTurn = 5000;
          }
          game.StartTimer(game.timePerTurn);
        }
      });
    });
  },
  AddPlayer: function (playerName) {
    // Find number of players already added to game
    const numPlayers = game.players.length;
    // Get dom references to player's name and score sections
    const $nameSection = $(`#player-${numPlayers + 1} .name`);
    const $scoreSection = $(`#player-${numPlayers + 1} .score`);
    // Instantiate a player object
    const newPlayer = new Player(playerName, $nameSection, $scoreSection);
    game.players.push(newPlayer);
  },
  SwitchPlayer: function () {
    let indexActivePlayer = game.players.indexOf(game.activePlayer);
    let indexNextPlayer =
      indexActivePlayer === game.players.length - 1 ? 0 : indexActivePlayer + 1;
    game.activePlayer = game.players[indexNextPlayer];
    game.HighlightActivePlayer();
  },

  HighlightActivePlayer: function () {
    // Highlight active player
    game.activePlayer.$nameDOM.css({ color: "beige", "font-weight": "bold" });
    game.activePlayer.$scoreDOM.css({ color: "beige", "font-weight": "bold" });
    // Mute other players
    for (let i = 0; i < game.players.length; i++) {
      if (game.players[i] === game.activePlayer) {
        continue;
      } else {
        game.players[i].$nameDOM.css({
          color: "#6d6875",
          "font-weight": "normal",
        });
        game.players[i].$scoreDOM.css({
          color: "#6d6875",
          "font-weight": "normal",
        });
      }
    }
  },

  SetupGameBoard: function () {
    //Stop theme song
    game.StopSound("theme");
    // Add players to DOM
    for (let player of game.players) {
      player.UpdatePlayerDOM();
    }
    // Add a tile grid
    game.tileGrid = new TileGrid(game.gridSize, game.difficulty);
    game.tileGrid.AddGrid("game-board");

    // Add event listener to tiles
    $(".cell").on("click", game.TileClickHandler);

    // Add event listeners to buttons and modify their appearances
    game.domPlaybtn.removeClass("btn-success");
    game.domPausebtn.addClass("btn-warning");
    game.domStopbtn.addClass("btn-danger");
    // Add event listeners to play-btn
    game.domPlaybtn.on("click", () => {
      game.ResumeGame();
    });
    // Add event listener to pause-btn
    game.domPausebtn.on("click", () => {
      game.PauseGame();
    });
    // Add event listener to stop-btn
    game.domStopbtn.on("click", () => {
      game.EndGame();
    });
    // Set game-running to true
    game.isRunning = true;
  },
  ResumeGame() {
    if (!game.isRunning) {
      // Change game status
      game.isRunning = true;
      // Activate Pause btn
      game.domPausebtn.addClass("btn-warning");
      // Resume Timer if game is timed
      if (game.isTimed) {
        game.ResumeTimer();
      }
      // Reactivate Clicks
      game.tileGrid.allowClick = true;
      // Flip tile (if unflipped)
      if (game.tileGrid.numTilesFlipped == 1) {
        game.tileGrid.FlipTile(
          game.tileGrid.prevFlippedTileNum,
          game.tileGrid.animals[game.tileGrid.prevFlippedTileNum]
        );
      }
      // Deactivate Play button
      game.domPlaybtn.removeClass("btn-success");
      // Remove the overlay
      game.domPauseOverLay.css({ display: "none" });
    }
  },
  PauseGame() {
    if (game.isRunning) {
      // Change game status
      game.isRunning = false;
      // Activate Play btn
      game.domPlaybtn.addClass("btn-success");
      //Pause Timer if game is timed
      if (game.isTimed) {
        game.PauseTimer();
      }
      // Unflip tile (if flipped)
      if (game.tileGrid.numTilesFlipped == 1) {
        game.tileGrid.UnflipTile(game.tileGrid.prevFlippedTileNum);
      }
      // Deactivate clicks
      game.tileGrid.allowClick = false;
      // Deactivate Pause btn
      game.domPausebtn.removeClass("btn-warning");
      // Add an overlay
      game.domPauseOverLay.css({ display: "flex" });
    }
  },
  EndGame: function () {
    game.SwitchScreen("game-over-screen");
    if (game.tileGrid.tilesSolved === game.tileGrid.numTiles) {
      let topScore = -4;
      let topScorerNames = [];
      // Check top score
      for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        const score = player.score;
        if (score > topScore) {
          topScore = score;
        }
      }

      // Check how many players have topScore
      for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        const score = player.score;
        if (score === topScore) {
          topScorerNames.push(player.name);
          console.log(topScorerNames);
        }
      }
      // Display winner(s)
      let winnerText = null;
      if (topScorerNames.length === 1) {
        winnerText = `And the winner is ${topScorerNames[0]}!!!`;
      } else if (topScorerNames.length === 2) {
        winnerText = `And the winners are ${topScorerNames[0]} & ${topScorerNames[1]} !!!`;
      } else if (topScorerNames.length === 3) {
        winnerText = `And the winners are ${topScorerNames[0]} & ${topScorerNames[1]} & ${topScorerNames[2]}!!!`;
      } else {
        winnerText = `And the winners are ${topScorerNames[0]} & ${topScorerNames[1]} & ${topScorerNames[2]} & ${topScorerNames[3]}!!!`;
      }
      game.TypeWriter(winnerText, "winner-text", 0);
    }
  },
  TileClickHandler: (event) => {
    // Get the cell id
    let cellId = event.target.id;
    // Get the cell num
    let tileNum = parseInt(cellId.slice(5, cellId.length));
    // Add actions only if tile has class unflipped-cell
    if (
      $(`#cell-${tileNum}`).hasClass("unflipped-cell") &&
      game.tileGrid.allowClick
    ) {
      // Get animal behind the cell / tile
      let currAnimal = game.tileGrid.animals[tileNum];
      // if joker, score -1 and remove joker
      if (currAnimal === "joker") {
        // Play sound
        game.PlaySound("joker");
        // Increment tiles Solved
        game.tileGrid.tilesSolved++;
        // Flip tile
        game.tileGrid.FlipTile(tileNum, currAnimal);
        // Score Penalty
        game.JokerPenalty();
        // Disallow click till delay expires
        game.tileGrid.allowClick = false;
        // Hide and make further changes after a delay
        window.setTimeout(() => {
          game.tileGrid.HideTile(tileNum);
          // Unflip tile if any tile is flipped
          if (game.tileGrid.numTilesFlipped === 1) {
            game.tileGrid.UnflipTile(game.tileGrid.prevFlippedTileNum);
            game.tileGrid.numTilesFlipped = 0;
            game.tileGrid.prevFlippedTileNum = null;
            game.tileGrid.prevFlippedAnimal = null;
          }
          // Now allow click
          game.tileGrid.allowClick = true;
          // Switch player
          game.SwitchPlayer();
          // If game is timed Clear timer and restart it
          if (game.isTimed) {
            window.clearInterval(game.timerId);
            game.StartTimer(game.timePerTurn);
          }
        }, 700);
      } else if (game.tileGrid.numTilesFlipped === 0) {
        // Play sound
        game.PlaySound("flip");
        // Flip this tile
        game.tileGrid.FlipTile(tileNum, currAnimal);
        game.tileGrid.numTilesFlipped = 1;
        game.tileGrid.prevFlippedAnimal = currAnimal;
        game.tileGrid.prevFlippedTileNum = tileNum;
      } else if (game.tileGrid.numTilesFlipped === 1) {
        // Flip this tile too
        game.tileGrid.FlipTile(tileNum, currAnimal);
        // Compare currAnimal to previously flipped animal
        if (currAnimal === game.tileGrid.prevFlippedAnimal) {
          // Play sound
          game.PlaySound("solve");
          // Score Points and update score DOM
          game.ScorePoints();
          // Update num of solved tiles
          game.tileGrid.tilesSolved += 2;
          // Disallow click till delay expires
          game.tileGrid.allowClick = false;
          // Hide both tiles after a delay of 1 second
          window.setTimeout(() => {
            game.tileGrid.HideTile(tileNum);
            game.tileGrid.HideTile(game.tileGrid.prevFlippedTileNum);
            // Reset prev tile properties
            game.tileGrid.numTilesFlipped = 0;
            game.tileGrid.prevFlippedTileNum = null;
            game.tileGrid.prevFlippedAnimal = null;
            // Now allow click
            game.tileGrid.allowClick = true;
            // Switch player
            game.SwitchPlayer();
            // If game is timed Clear timer and restart it
            if (game.isTimed) {
              window.clearInterval(game.timerId);
              game.StartTimer(game.timePerTurn);
            }
          }, 700);
        } else {
          // Play sound
          game.PlaySound("flip");
          // Disallow click till delay expires
          game.tileGrid.allowClick = false;
          //flip both tiles after a delay of a second
          window.setTimeout(() => {
            game.tileGrid.UnflipTile(tileNum);
            game.tileGrid.UnflipTile(game.tileGrid.prevFlippedTileNum);
            // Reset prev tile properties
            game.tileGrid.numTilesFlipped = 0;
            game.tileGrid.prevFlippedTileNum = null;
            game.tileGrid.prevFlippedAnimal = null;
            // Now allow click
            game.tileGrid.allowClick = true;
            //Switch player
            game.SwitchPlayer();
            // If game is timed Clear timer and restart it
            if (game.isTimed) {
              window.clearInterval(game.timerId);
              game.StartTimer(game.timePerTurn);
            }
          }, 700);
        }
      }
      // If all tiles have been solved, end game
      if (game.tileGrid.tilesSolved === game.tileGrid.numTiles) {
        game.EndGame();
      }
    }
  },

  ScorePoints: function () {
    game.activePlayer.score++;
    game.activePlayer.UpdatePlayerDOM();
  },

  JokerPenalty: function () {
    if (game.difficulty === "Easy") {
      game.activePlayer.score--;
    } else if (game.difficulty === "Medium") {
      game.activePlayer.score = game.activePlayer.score - 2;
    } else {
      game.activePlayer.score = game.activePlayer.score - 3;
    }
    game.activePlayer.UpdatePlayerDOM();
  },

  StartTimer: function (totTime) {
    game.timeRemaining = totTime;
    game.timerId = window.setInterval(() => {
      let seconds = Math.floor(game.timeRemaining / 1000);
      let deciSeconds = Math.floor((game.timeRemaining - seconds * 1000) / 100);
      game.domClock.text(`${seconds}.${deciSeconds}`);
      game.timeRemaining = game.timeRemaining - 100;
      if (game.timeRemaining <= 2000) {
        game.domClock.css({ color: "red", "font-weight": "bold" });
      } else {
        game.domClock.css({ color: "green", "font-weight": "normal" });
      }
      // If time per turn expires
      if (game.timeRemaining == 0) {
        window.clearInterval(game.timerId);
        game.StartTimer(game.timePerTurn);
        // if the there is an unflipped tile, flip it
        if (game.tileGrid.numTilesFlipped === 1) {
          game.tileGrid.UnflipTile(game.tileGrid.prevFlippedTileNum);
          // Reset prev tile properties
          game.tileGrid.numTilesFlipped = 0;
          game.tileGrid.prevFlippedTileNum = null;
          game.tileGrid.prevFlippedAnimal = null;
        }
        // Switch player
        game.SwitchPlayer();
      }
    }, 100);
  },
  PauseTimer: function () {
    window.clearInterval(game.timerId);
    game.domClock.text("--");
  },
  ResumeTimer: function () {
    game.StartTimer(game.timeRemaining);
  },
  CreateNameForm: function (num) {
    // Create a form element and set its ID
    const form = document.createElement("form");
    // Set id according to the setup screen
    let formID = "";
    if (game.numPlayers === 1) {
      formID = "player-1-name";
    } else {
      formID = "other-players-name";
    }
    form.setAttribute("id", formID);
    // Create a section to hold text inputs set its id
    const inputSection = document.createElement("section");
    inputSection.setAttribute("class", "name-form-input");
    // Create name inputs depending on number of players
    for (let i = 0; i < num; i++) {
      const playerTag = this.numPlayers == 1 ? 1 : 2;
      const nameInput = document.createElement("input");
      nameInput.setAttribute("type", "text");
      nameInput.setAttribute(
        "placeholder",
        `Explorer ${playerTag + i}'s Name Here`
      );
      nameInput.setAttribute("id", `player-${playerTag + i}-name-input`);
      nameInput.setAttribute("class", `player-names-input`);
      // Add name text input to input section
      inputSection.append(nameInput);
    }
    // Append input section to form
    form.append(inputSection);
    // Create and append a button to input form
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.setAttribute(
      "class",
      "btn btn-warning btn-lg box-shadow--10d continue-btns"
    );
    submitButton.setAttribute("id", `${formID}-submit`);
    submitButton.innerText = "c o n t i n u e !";
    form.append(submitButton);
    return form;
  },
  CreateSetupForm: function () {
    // Create a form element and set its ID
    const $setupForm = $("<form>").attr("id", "setup-form");
    // Create a select element for grid size
    $setupForm.append(`<div class="form-group">
    <label for="grid-selection">Select Grid Size</label>
    <select class="form-control" id="grid-selection">
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      <option>9</option>
    </select>
  </div>`).append(`<div class="form-group">
  <label for="mode-selection">Select Mode</label>
  <select class="form-control" id="mode-selection">
    <option>Standard</option>
    <option>Timed</option>
  </select>
</div>`).append(`<div class="form-group">
<label for="difficulty-selection">Select Difficulty Level</label>
<select class="form-control" id="difficulty-selection">
  <option>Easy</option>
  <option>Medium</option>
  <option>Hard</option>
</select>
</div>`);
    // Append a submit button
    $setupForm.append();
    // Return form
    return $setupForm;
  },
  // Function for TypeWriter effect on text
  TypeWriter: function (typedText, paraEle, i, callback) {
    if (i < typedText.length) {
      $(`#${paraEle}`).append(typedText.charAt(i));
      i++;
      setTimeout(() => {
        this.TypeWriter(typedText, paraEle, i, callback);
      }, game.typeWriterInterval);
    } else {
      game.typeWriterInterval = 70;
      if (callback) {
        callback();
      }
    }
  },
  ActivateSkip: function () {
    // Using Delegation since the screen does not exist when the function is called
    $("body").on("click", "#skip-btn", function () {
      game.typeWriterInterval = 0;
    });
  },
  // Function to get current time
  CurrTime() {
    let today = new Date();
    let curHr = today.getHours();
    if (curHr < 12) {
      return "morning";
    } else if (curHr < 18) {
      return "afternoon";
    } else {
      return "evening";
    }
  },
  // Function to manage in-game sound
  ManageSound: function () {
    // Create an AudioContext only if not already created
    if (!game.audioContext) {
      game.audioContext = new (window.AudioContext || window.AudioContext)();
      // Create a gain node
      game.gainNode = game.audioContext.createGain();
      // Connect the gain node to the AudioContext destination (speakers)
      game.gainNode.connect(game.audioContext.destination);
    }
    // Add event listener to sound-btn
    game.domSoundbtn.on("click", game.ToggleMute);
  },
  // Function to toggle mute status
  ToggleMute: function () {
    if (game.gainNode.gain.value === 0) {
      // If muted, unmute and change sound-btn text
      game.gainNode.gain.setValueAtTime(1, game.audioContext.currentTime);
      game.domSoundbtn.html(`<i class="bi bi-volume-mute-fill"></i>`);
      console.log("muted");
    } else {
      // If unmuted, mute and change sound-btn text
      game.gainNode.gain.setValueAtTime(0, game.audioContext.currentTime);
      game.domSoundbtn.html(`<i class="bi bi-volume-up-fill"></i>`);
      console.log("unmuted");
    }
  },
  // Function to play a specific sound
  PlaySound: function (sound) {
    // get filePath
    const soundFilePath = game.gameSounds[sound].path;
    console.log(soundFilePath);
    // Create an AudioBufferSourceNode
    const source = game.audioContext.createBufferSource();
    // Add this to source property of gameSound object
    game.gameSounds[sound].source = source;
    // Fetch and decode the audio file
    fetch(soundFilePath)
      .then((response) => response.arrayBuffer())
      .then((buffer) => game.audioContext.decodeAudioData(buffer))
      .then((decodedData) => {
        // Set the buffer for the source
        source.buffer = decodedData;
        // Connect the source to the gain node
        source.connect(game.gainNode);
        // Start playing the sound
        source.start();
      })
      .catch((error) =>
        console.error("Error loading and playing sound:", error)
      );
  },
  StopSound: function (sound) {
    game.gameSounds[sound].source.stop();
  },
};

$(() => {
  // Enter the game
  game.Init();
  // Initialize AudioContext in response to a user action
  $(document).on("click", () => {
    if (game.audioContext.state === "suspended") {
      console.log("hi");
      game.audioContext
        .resume()
        .then(() => {
          console.log("AudioContext resumed successfully.");
          // Now play sound
          game.PlaySound("theme");
        })
        .catch((error) => {
          console.error("Error resuming AudioContext:", error);
        });
    }
  });
});
