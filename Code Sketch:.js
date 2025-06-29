let comboCount = 0, comboTimer = 0;

function playerAttack(type) {
  // Type: "light"/"heavy"/"special"
  // Spawn attack hitbox with properties
}
function onEnemyHit() {
  comboCount++;
  comboTimer = MAX_TIME; // resets timer
  // If comboCount == 5/10/20 update multiplier
}
function updateCombo(dt) {
  if(comboTimer > 0) comboTimer -= dt;
  else comboCount = 0;
}