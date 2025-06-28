function mainLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  switch (gameState) {
    case "title":
      drawTitle(); break;
    case "charselect":
      drawCharSelect(); break;
    case "levelselect":
      drawLevelSelect(); break;
    default:
      drawTitle(); break;
  }
  requestAnimationFrame(mainLoop);
}
mainLoop();

window.addEventListener('keydown', function(e) {
  if (gameState === "title") {
    gameState = "charselect";
  } else if (gameState === "charselect") {
    if (e.key === "ArrowRight") selectedCharIdx = (selectedCharIdx+1)%CHARACTERS.length;
    if (e.key === "ArrowLeft") selectedCharIdx = (selectedCharIdx-1+CHARACTERS.length)%CHARACTERS.length;
    if (e.key === "Enter") gameState = "levelselect";
  } else if (gameState === "levelselect") {
    if (e.key === "ArrowDown") selectedLevelIdx = (selectedLevelIdx+1)%LEVELS.length;
    if (e.key === "ArrowUp") selectedLevelIdx = (selectedLevelIdx-1+LEVELS.length)%LEVELS.length;
    if (e.key === "Enter") {
      resetGamePlay();
      gameState = "playing";
    }
  }
});