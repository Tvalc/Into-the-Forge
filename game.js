// === Documentation-driven implementation of Forgeborn vertical slice ===

const GAME_WIDTH = 800, GAME_HEIGHT = 600;

// Documented characters (abbreviated for vertical slice)
const CHARACTERS = [
  {
      name:"Korok", faction:"Tempys",
      stats:{hpMax:120, atk:18, def:7, spd:4},
      desc:"Tank with area control. Fire/Stone abilities.",
      portrait:"assets/char/korok.png"
  },
  {
      name:"Oros", faction:"Alloyin",
      stats:{hpMax:80, atk:12, def:5, spd:7},
      desc:"Ranged/defense specialist. Energy/Shield powers.",
      portrait:"assets/char/oros.png"
  },
  {
      name:"Cercee", faction:"Uterra",
      stats:{hpMax:100, atk:14, def:6, spd:6},
      desc:"Nature manipulator. Support/crowd control.",
      portrait:"assets/char/cercee.png"
  }
];

// Documented scene data (first scene only for slice)
const SCENE = {
   bg:"assets/bg/frozen_wastes_1.png",
   name:"Frozen Wastes – Scene 1",
   enemies:[
     {type:"Frostling", x:600, y:440, hp:24, spd:-1.2},
     {type:"Frostling", x:750, y:440, hp:22, spd:-1.6}
   ]
};

// Core state
let $container = null, gameState = "menu", selectedChar = null, gameData = null;

// ========== INIT ==========
window.addEventListener('DOMContentLoaded', () => {
   $container = document.getElementById('game-container');
   showMenu();
});

function clearUI() { $container.innerHTML = ''; }

// ========== MENU / CHARACTER SELECT ==========

function showMenu() {
   clearUI();
   gameState = "menu";
   const $screen = document.createElement('div');
   $screen.className = "screen";
   $screen.innerHTML = `
     <div class="title">FORGEBORN:<br>Solstice Break</div>
     <div class="subtitle">Descend into the Frozen Wastes.<br><span style="color:#b3bedc">A vertical slice demo.</span></div>
     <div class="menu-panel">
       <div style="margin-bottom:.7em;font-size:.98em;color:#b3bedc">Choose your Forgeborn:</div>
       <div class="character-select-grid">
         ${CHARACTERS.map((c,i)=>`
           <div class="character-card" data-ch="${i}">
             <img class="character-portrait" src="${c.portrait}">
             <div class="character-name">${c.name}</div>
             <div class="character-desc">${c.desc}</div>
           </div>`).join('')}
       </div>
       <button class="button" id="btn-start" disabled>Start Adventure</button>
     </div>
     <div style="margin-top:.9em;font-size:.89em;color:#6dc7ff55">
       &copy; Forgeborn Project Demo
     </div>
   `;
   $container.appendChild($screen);

   let selIdx = null;

   // Card select logic
   const cards = [...$screen.querySelectorAll('.character-card')];
   cards.forEach(card => card.onclick = () => {
      cards.forEach(cc=>cc.classList.remove('selected'));
      card.classList.add('selected');
      selIdx = parseInt(card.dataset.ch);
      document.getElementById('btn-start').disabled = false;
   });
   document.getElementById('btn-start').onclick = () => {
      if(selIdx!==null) {
         selectedChar = CHARACTERS[selIdx];
         startGame();
      }
   };
}

// ========== GAMEPLAY ==========

// Main game loop data and objects
function startGame() {
   clearUI();
   gameState = "playing";
   gameData = createGameData(selectedChar);

   // UI bar
   const $uiBar = document.createElement('div');
   $uiBar.className = "game-ui-bar";
   $uiBar.innerHTML = `
     <div class="ui-bar-inner">
        <img class="ui-icon" src="${selectedChar.portrait}">
        <span class="ui-label">HP</span>
        <span class="health-bar-bg">
          <span class="health-bar-fg" id="ui-hp-fg" style="width:${100}%"></span>
        </span>
        <span class="ui-label">Score:<span class="ui-value" id="ui-score">${gameData.score}</span></span>
        <span class="ui-label">Scene:<span class="ui-value">${SCENE.name}</span></span>
     </div>
   `;
   $container.appendChild($uiBar);

   // Canvas for gameplay rendering
   const $canvas = document.createElement('canvas');
   $canvas.id = "game-canvas";
   $canvas.width = GAME_WIDTH;
   $canvas.height = 480;
   $container.appendChild($canvas);

   // Message area (for win/lose messages)
   const $msg = document.createElement('div');
   $msg.className = "game-message";
   $msg.id = "game-message";
   $container.appendChild($msg);

   // Preload BG image then start loop
   const bgImg = new Image();
   bgImg.src = SCENE.bg;
   bgImg.onload = () => runGameLoop($canvas, bgImg);
}

function createGameData(char) {
 return {
     player:{
       ...char.stats,
       hpCur:+char.stats.hpMax,
       x:80,y:400,vx:0,vy:0,onGround:true,
       atkTimer:-1,dodgeTimer:-1,
     },
     enemies:(SCENE.enemies.map(e=>({...e,hpCur:e.hp}))),
     score:0,
     state:"playing",
     timerFramesAlive:0,
 };
}

// Game loop with documented mechanics
function runGameLoop($canvas,bgImg) {
 const ctx=$canvas.getContext('2d');
 let keys={}, lastTs=performance.now();

 window.onkeydown=(e)=>{keys[e.code]=true};
 window.onkeyup=(e)=>{keys[e.code]=false};

 function update(dt) {
     let pd=gameData.player,enemies=gameData.enemies;

     // Movement & gravity
     if(gameData.state==="playing") {
       // Horizontal move
       if(keys['ArrowLeft']) pd.vx=-pd.spd*2.2;
       else if(keys['ArrowRight']) pd.vx=pd.spd*2.2;
       else pd.vx*=.78;

       // Jump
       if(keys['ArrowUp']&&pd.onGround) {pd.vy=-9.6;pd.onGround=false;}

       // Dodge (C key), short invuln burst
       if(keys['KeyC']&&pd.dodgeTimer<0) {pd.dodgeTimer=18;}
       if(pd.dodgeTimer>=0) pd.dodgeTimer--;

       // Attack (Z light / X heavy)
       if(keys['KeyZ']&&pd.atkTimer<0) {pd.atkTimer=12;} // Light attack short cooldown
       if(keys['KeyX']&&pd.atkTimer<0) {pd.atkTimer=22;} // Heavy attack longer cooldown
       if(pd.atkTimer>=0) pd.atkTimer--;

       // Apply physics
       pd.x+=pd.vx*dt/16.67; pd.y+=pd.vy*dt/16.67;

       // Gravity and ground check
       if(!pd.onGround) pd.vy+=.78*dt/16.67;
       if(pd.y>=400) {pd.y=400;pd.vy=0;pd.onGround=true;}
       pd.x=Math.max(0,Math.min(GAME_WIDTH-44,pd.x));

       // Player attacks → check collision with enemies (simple hitbox)
       for(let en of enemies) if(en.hpCur>0 && Math.abs(en.x-pd.x)<48 && Math.abs(en.y-pd.y)<38 && pd.atkTimer===10) {
         en.hpCur-= (keys['KeyZ']?pd.atk*1.05 : (keys['KeyX']?pd.atk*1.65 : pd.atk));
         gameData.score+=60+(keys['KeyX']?30 : 0);
       }
       
       // Enemy AI – move toward player + attack (basic vertical slice logic)
       for(let en of enemies){
         if(en.hpCur<=0) continue;
         en.x+=en.spd*dt/16.67;
         if(Math.abs(en.x-pd.x)<38 && Math.abs(en.y-pd.y)<34 && pd.dodgeTimer<5){
            // Enemy hits player unless dodging or just attacked
            pd.hpCur-=2+Math.random()*1.3|0;
         }
         // Clamp enemy to stage area
         en.x=Math.max(80,Math.min(GAME_WIDTH-80,en.x));
       }

       // Remove dead enemies
       if(enemies.every(e=>e.hpCur<=0)){
          gameData.state='win';
          setTimeout(()=>showWinScreen(),850);
       }
       
       // Player death
       if(pd.hpCur<=0){
          gameData.state='lose';
          setTimeout(()=>showGameOver(),850);
       }

       gameData.timerFramesAlive++;
     }
 }

 function render() {
     ctx.clearRect(0,0,GAME_WIDTH,480);
     // BG image per documented scene
     ctx.drawImage(bgImg,0,0,GAME_WIDTH,480);

     // Draw player (simple rectangle + color)
     let pd=gameData.player;
     ctx.save();
     ctx.translate(pd.x,pd.y);
     ctx.globalAlpha=pd.dodgeTimer>7?.55 : 1.0;

     ctx.fillStyle="#ff983a"; // Korok color default
     if(selectedChar.name==="Oros") ctx.fillStyle="#63eaff";
     else if(selectedChar.name==="Cercee") ctx.fillStyle="#67ff96";
     ctx.fillRect(-18,-36,36,44);

     ctx.restore();

     // Draw enemies
     for(let en of gameData.enemies){
        if(en.hpCur<=0) continue;
        ctx.save();
        ctx.translate(en.x,en.y);
        ctx.fillStyle="#aaf6ff";
        ctx.strokeStyle="#166fc7";
        ctx.lineWidth=2.3;
        ctx.beginPath();
        ctx.arc(0,-22,17,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.restore();

        // HP bar (above enemy)
        ctx.fillStyle="#305888";
        ctx.fillRect(en.x-16,en.y-38,32,4);
        ctx.fillStyle="#ff5555";
        ctx.fillRect(en.x-16,en.y-38,(en.hpCur/en.hp)*32,4);
     }

     // HUD floating indicators (score up)
     // ...

 }

 function updateUI() {
     let pct=Math.max(0,(gameData.player.hpCur/gameData.player.hpMax)*100);
     document.getElementById('ui-hp-fg').style.width=pct+"%";
     document.getElementById('ui-score').textContent=gameData.score|0;
 }

 function loop(ts) {
     let dt=Math.min(ts-lastTs,32); lastTs=ts;
     update(dt); render(); updateUI();
     if(gameData.state==="playing") requestAnimationFrame(loop);
 }

 requestAnimationFrame(loop);
}

// ========== WIN / LOSE SCREENS ==========
function showWinScreen() {
 clearUI();
 const $s=document.createElement('div');
 $s.className='screen';
 $s.innerHTML=`
   <div class='gameover-panel'>
      <div class='gameover-title' style='color:#7fc3fe'>SCENE CLEARED</div>
      <div class='gameover-sub'>You defeated all enemies in the Frozen Wastes.</div>
      <div><span class='score-label'>Score:</span> <span class='score-value'>${gameData.score|0}</span></div>
      <button class='button' id='btn-menu'>Back to Menu</button>
   </div>`;
 $container.appendChild($s);
 document.getElementById('btn-menu').onclick=showMenu;
}

function showGameOver() {
 clearUI();
 const $s=document.createElement('div');
 $s.className='screen';
 $s.innerHTML=`
   <div class='gameover-panel'>
      <div class='gameover-title'>DEFEATED</div>
      <div class='gameover-sub'>You fell in the Frozen Wastes.<br>Try again!</div>
      <div><span class='score-label'>Score:</span> <span class='score-value'>${gameData.score|0}</span></div>
      <button class='button' id='btn-menu'>Back to Menu</button>
   </div>`;
 $container.appendChild($s);
 document.getElementById('btn-menu').onclick=showMenu;
}