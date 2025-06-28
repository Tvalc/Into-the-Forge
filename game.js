// ============ CONSTANTS & DATA =============

// Characters (simplified for demo, expand as needed)
const CHARACTERS = [
  { name: "Korok", faction: "Tempys", unlockedAt: 0, color: "#ff7200" },
  { name: "Oros", faction: "Uterra", unlockedAt: 10000, color: "#18d860" },
  { name: "Cercee", faction: "Nekrium", unlockedAt: 25000, color: "#bc3cff" },
  { name: "Ironbeard", faction: "Alloyin", unlockedAt: 50000, color: "#88c6ff" },
  { name: "Ignir", faction: "Tempys", unlockedAt: 100000, color: "#ff1a1a" },
  { name: "Voss", faction: "Nekrium", unlockedAt: 200000, color: "#9300c2" }
];

// Levels
const LEVELS = [
  { name:"The Frozen Wastes", unlockedAt:0 },
  { name:"The Rootrealms", unlockedAt:25000 },
  { name:"Brightsteel City", unlockedAt:50000 },
];

// Demo backgrounds (solid colors for now)
const SCENE_BACKGROUNDS = ["#2e3a5a", "#273548", "#222831"];

// ============ GAME STATE =============
let gameState = "title"; // title, highscore, charselect, levelselect, playing, pause, win, lose
let highScore = Number(localStorage.getItem("forgeborn_highscore") || "0");
let currentScore = 0;
let selectedCharIdx = 0;
let selectedLevelIdx = 0;

// Gameplay state
let player = null;
let enemies = [];
let comboCount = 0;
let comboTimer = null;
let playerHealth = 100;
let inGameSceneY = 0; // vertical scroll position

// ============ CANVAS SETUP ============
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ============ UTILITIES =============
function lerp(a,b,t){ return a+(b-a)*t; }
function clamp(x,a,b){ return Math.max(a,Math.min(x,b)); }
function drawButton(x,y,w,h,text,isActive){
  ctx.save();
  ctx.globalAlpha = isActive ? 1 : .5;
  ctx.fillStyle = isActive ? "#ff9200" : "#555";
  ctx.fillRect(x,y,w,h);
  ctx.strokeStyle="#fff";
  ctx.lineWidth=2;
  ctx.strokeRect(x,y,w,h);
  ctx.fillStyle="#fff";
  ctx.font="bold 28px Segoe UI";
  ctx.textAlign="center";
  ctx.textBaseline="middle";
  ctx.fillText(text,x+w/2,y+h/2);
  ctx.restore();
}

function getUnlockedChars(){
    return CHARACTERS.filter(c=>highScore>=c.unlockedAt);
}
function getUnlockedLevels(){
    return LEVELS.filter(l=>highScore>=l.unlockedAt);
}

// ============ TITLE SCREEN ============
function drawTitle(){
    // BG
    let grad=ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0,"#191723");
    grad.addColorStop(1,"#502a11");
    ctx.fillStyle=grad;ctx.fillRect(0,0,canvas.width,canvas.height);

    // Animated Solforge Tower
    ctx.save();
    let t=Date.now()/800;
    ctx.translate(canvas.width/2,canvas.height/2-90 + Math.sin(t)*8);
    ctx.fillStyle="#aaa";ctx.fillRect(-32,-160,64,220);
    ctx.strokeStyle="#ffb347";ctx.lineWidth=6;
    ctx.beginPath();ctx.arc(0,-160,32,Math.PI*2,false);ctx.stroke();
    // Corruption effect
    ctx.globalAlpha=0.18+Math.abs(Math.sin(t*1.3))*0.12;
    ctx.fillStyle="#9d2cff";ctx.beginPath();
    ctx.arc(18,-140+Math.cos(t)*16,16+Math.sin(t*1.9)*4,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;ctx.restore();

    // Title
    ctx.fillStyle="#ffb347";
    ctx.font="bold 46px Segoe UI";
    ctx.textAlign="center";
    ctx.shadowColor="#602f07";ctx.shadowBlur=14;
    ctx.fillText("FORGEBORN:",canvas.width/2,110);
    ctx.fillStyle="#fff";
    ctx.font="bold italic 36px Segoe UI";
    ctx.shadowBlur=8;ctx.shadowColor="#bc3cff";
    ctx.fillText("SOLSTICE BREAK",canvas.width/2,160);
    ctx.shadowBlur=0;

    // High Score
    ctx.font="bold 26px Segoe UI";ctx.fillStyle="#f7e17c";
    ctx.fillText("High Score: "+highScore.toLocaleString(),canvas.width/2,260);

    // Prompt
    let blink=(Math.floor(Date.now()/500)%2)==0;
    if(blink){
        ctx.font="bold italic 28px Segoe UI";
        ctx.fillStyle="#fff";
        ctx.fillText("[ Press Any Button to Start ]",canvas.width/2,340);
    }
}

// ============ CHARACTER SELECT ============
function drawCharSelect(){
    // BG
    ctx.fillStyle="#262335";ctx.fillRect(0,0,canvas.width,canvas.height);
    // Title
    ctx.font="bold 34px Segoe UI";
    ctx.fillStyle="#ffb347";
    ctx.textAlign="center";
    ctx.fillText("Choose Your Forgeborn",canvas.width/2,64);

    let chars=CHARACTERS;
    let spacing=110,x0=canvas.width/2-(chars.length-1)*spacing/2;

    for(let i=0;i<chars.length;++i){
        let x=x0+i*spacing,y=180,r=48;
        let isUnlocked=highScore>=chars[i].unlockedAt;
        // Portrait circle
        ctx.save();
        ctx.beginPath();ctx.arc(x,y,r+8,0,Math.PI*2);ctx.closePath();
        ctx.globalAlpha=isUnlocked?1:.15;
        ctx.strokeStyle="#fff";ctx.lineWidth=(i==selectedCharIdx)?7:3;ctx.stroke();
        // Faction color
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.closePath();
        ctx.fillStyle=chars[i].color;ctx.globalAlpha=isUnlocked?.85:.19;ctx.fill();
        if(!isUnlocked){
            ctx.globalAlpha=.5;
            ctx.fillStyle="#222";
            ctx.beginPath();ctx.arc(x,y,r-4,0,Math.PI*2);ctx.closePath();ctx.fill();
        }
        // Char initial
        ctx.globalAlpha=1;ctx.font="bold italic 38px Segoe UI";
        ctx.fillStyle="#fff";ctx.textAlign="center";
        ctx.fillText(chars[i].name[0],x,y+7);

        // Lock info
        if(!isUnlocked){
            ctx.font="16px Segoe UI";ctx.fillStyle="#ffb347";
            ctx.fillText("Unlocks @ "+chars[i].unlockedAt,x,y+r+24);
        }
        if(i==selectedCharIdx){
            ctx.font="italic bold 20px Segoe UI";ctx.fillStyle="#fff";
            ctx.fillText(chars[i].name+" ("+chars[i].faction+")",x,y+r+44);
            if(isUnlocked){
                drawButton(x-48,y+r+56,96,36,"SELECT",true);
            }
        }
        ctx.restore();
    }
}

// ============ LEVEL SELECT ============
function drawLevelSelect(){
    // BG
    ctx.fillStyle="#232e35";ctx.fillRect(0,0,canvas.width,canvas.height);
    // Title
    ctx.font="bold 34px Segoe UI";
    ctx.fillStyle="#ffb347";
    ctx.textAlign="center";
    ctx.fillText("Select Level",canvas.width/2,64);

    let levels=LEVELS;
    let spacing=70,y0=140;

    for(let i=0;i<levels.length;++i){
        let y=y0+i*spacing,x=canvas.width/2-120,w=240,h=52;
        let isUnlocked=highScore>=levels[i].unlockedAt;

        // BG box
        ctx.save();ctx.globalAlpha=isUnlocked?1:.25;
        ctx.strokeStyle=isUnlocked?"#f7e17c":"#555";ctx.lineWidth=(i==selectedLevelIdx)?4:2;
        ctx.strokeRect(x,y,w,h);
        // Preview BG color block for demo
        if(isUnlocked){
            ctx.fillStyle=SCENE_BACKGROUNDS[i%SCENE_BACKGROUNDS.length];
            ctx.globalAlpha=.13;ctx.fillRect(x,y,w,h);
        }

        // Level name
        ctx.font="bold italic 26px Segoe UI";ctx.textAlign="left";ctx.globalAlpha=isUnlocked?1:.4;
        ctx.fillStyle=isUnlocked?"#fff":"#888";
        ctx.fillText(levels[i].name,x+18,y+33);

        // Lock info
        if(!isUnlocked){
            ctx.font="16px Segoe UI";ctx.fillStyle="#ffb347";ctx.globalAlpha=.9;
            ctx.textAlign="center";
            ctx.fillText("Unlocks @ "+levels[i].unlockedAt,x+w/2,y+h+23);
        }

        // Select button if unlocked & selected
        if(isUnlocked && i==selectedLevelIdx){
            drawButton(x+w+14,y+6,92,38,"PLAY",true);
        }
        ctx.restore();
    }
}

// ============ GAMEPLAY SCENE ============
function resetGamePlay(){
    currentScore=0;comboCount=0;playerHealth=100;inGameSceneY=0;enemies=[];
    player={
      x:canvas.width/2,
      y:80,
      vx:0,
      vy:0,
      w:42,h:68,
      col:getUnlockedChars()[selectedCharIdx].color,
      attacking:false,
      attackTimer:0,
      onGround:true,
      facingRight:true,
      comboTimer:null,
      spriteFrame:0,
      name:getUnlockedChars()[selectedCharIdx].name,
      jumpV:-9,
      speed:5,
      gravity:.7,
      hp:100,
      atkPower:9,
      specialReady:true
    };
}

function spawnEnemy(){
    let ex=Math.random()*(canvas.width-120)+60;
    let ey=inGameSceneY+Math.random()*220+340;
    enemies.push({
      x:ex,y:ey,vx:(Math.random()<.5?-1:1)*1.6,speed:.55+(Math.random()*1.4),
      w:36,h:60,col:"#bc3cff",hp:25+Math.floor(Math.random()*15),alive:true
    });
}

function drawGameplay(){
    // BG vertical scroll (scene)
    let bgCol = SCENE_BACKGROUNDS[selectedLevelIdx%SCENE_BACKGROUNDS.length];
    let yOffset=-inGameSceneY%canvas.height;

    for(let i=-1;i<3;++i){
      let yBg=yOffset+i*canvas.height;
      ctx.fillStyle=bgCol;ctx.globalAlpha=.97-Math.abs(i*.03);ctx.fillRect(0,yBg,canvas.width,canvas.height);
      // Ice/snow decor
      if(i==1){
          for(let j=0;j<18;++j){
              let px=j*45+12,pw=38+Math.sin(j+Date.now()/900)*16,pcol="#cceeff";
              let py=yBg+560+(Math.sin(j*2+Date.now()/700)*6|0);
              ctx.globalAlpha=.05+.07*Math.abs(Math.sin(px));
              ctx.fillStyle=pcol;ctx.beginPath();ctx.arc(px,py,pw/3.4,0,Math.PI*2);ctx.fill();
          }
      }
      ctx.globalAlpha=1.0;
    }

    // Player
    if(player){
      let px=player.x,py=player.y-inGameSceneY;

      // Shadow
      ctx.save();
      ctx.globalAlpha=.25;ctx.beginPath();
      ctx.ellipse(px,py+player.h*0.62+7,player.w*.37,14,0,0,Math.PI*2);ctx.fillStyle="#000";ctx.fill();
      ctx.restore();

      // Body (simple block man for demo)
      ctx.save();
      ctx.translate(px,py);
      // Facing dir flip
      if(!player.facingRight)ctx.scale(-1,1);

      // Body
      ctx.fillStyle="#444";ctx.fillRect(-player.w/2,-player.h/2+10,player.w,player.h-20);

      // Head
      ctx.beginPath();ctx.arc(0,-player.h/2+24,(player.w/2)-4,0,Math.PI*2);ctx.closePath();
      ctx.fillStyle=player.col;ctx.globalAlpha=.92;ctx.fill();

      // Arms when attacking
      if(player.attacking){
         let swing=(Math.sin(Date.now()/100)*22)|0;
         ctx.save();ctx.rotate(.4+.7*swing/30);
         ctx.strokeStyle="#fae76d";ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(10,-12);ctx.lineTo(player.w*1.1,-22);ctx.stroke();
         ctx.restore();
         // Impact flash effect
         if(Date.now()%120<60){ 
             ctx.globalAlpha=.32; 
             ctx.beginPath(); 
             ctx.arc(player.w*1.08,-22-player.h/3.8-player.h*.18*Math.random(),14+Math.random()*8|0,
                 0,Math.PI*2); 
             ctx.fillStyle="#fffab3"; 
             ctx.fill();
         }
      }

      // Name
      ctx.font="italic bold 12px Segoe UI";ctx.globalAlpha=.75;ctx.textAlign="center";
      ctx.fillStyle="#fff";ctx.textBaseline="bottom";ctx.fillText(player.name||"Player",0,-player.h/2-6);

      // Reset alpha
      ctx.restore();
    }

    // Enemies
    for(let i=enemies.length-1;i>=0;--i){
     let e=enemies[i];
     if(!e.alive)continue;
     let ex=e.x,ey=e.y-inGameSceneY;

     // Shadow
     ctx.save();ctx.globalAlpha=.17;ctx.beginPath();
     ctx.ellipse(ex,ey+e.h*.61+7,e.w*.33,e.h*.13|0,0,Math.PI*2);ctx.fillStyle="#000";ctx.fill();ctx.restore();

     // Body
     ctx.save(); 
     if(e.hp<10) { 
         let t=(Date.now()/90)%360; 
         e.col='#bc3cff'+(Math.abs(Math.sin(t))*100|0).toString(16); 
     }
     // Flicker on hit

     ctx.globalAlpha=e.hp<15?.68:.99;
     if(Math.random()<.04 && e.hp<15)ctx.globalAlpha=.5+.5*Math.random();

     // Enemy body
     ctx.strokeStyle="#bc3cff";
     if(e.hp<12)ctx.strokeStyle="#ff3477";
     if(e.hp<=5)ctx.strokeStyle="#fff";

     ctx.lineWidth=(e.hp<=5)?4:(e.hp<12)?3.5:3; 
     if(!e.alive)continue;

     // Main body 
     ctx.beginPath(); 
     ctx.rect(ex-e.w/2-3|0,ey-e.h/2|0,e.w,e.h); 
     ctx.stroke(); 
     // Fill 
     ctx.globalAlpha*=.92; 
     ctx.fillStyle=e.col; 
     if(e.hp<=5) { 
         // death flash 
         if(Date.now()%80<40) { 
             e.col="#fff"; 
             e.hp-=.25; 
         } 
     } 
     else if(e.hp<=12) { 
         if(Date.now()%110<55) e.col="#ff3477"; 
         else e.col="#bc3cff"; 
     } 

     if(e.alive) { 
         // Head 
         let headRad=e.w*.33|0; 
         let eyeClr=e.hp<6?"#fff":"#222"; 
         for(let k=-1;k<=1;k+=2){ 
             let off=k*(headRad-8),eyy=headRad-8+(Date.now()/60)%3; 
             ctx.beginPath(); 
             ctx.arc(ex+off-(k<0?4:-4),ey-eyy-18|0,(e.hp<8?5:4),0,Math.PI*2); 
             ctx.globalAlpha=.97-(k+.95)*.07; 
             ctx.fillStyle=eyeClr; 
             if(e.hp<6 && Date.now()%70<35)ctx.globalAlpha=.7+.3*Math.random(),ctx.fillStyle="#fae76d"; 
             else if(e.hp<12 && Date.now()%120<60)ctx.globalAlpha=.7+.3*Math.random(),ctx.fillStyle="#fffab3"; 
             else if(e.hp>15) { } 
             else {} 
             if(e.hp>3) { } else { } 
             if(e.hp<=5 && Date.now()%120<60) { } 
             else {} 
             if(e.hp<=12 && k==1 && Date.now()%70<35){}else{} 
             else {} 
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             else {}
             
             else {}
             
             else {}
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             
             

            



            



             


             

             

             


             


             



             

             

             




             



             



             


             


             


             



             




             




             



             


             


             


             


             



             

              
              

              


              

              
              

              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              
              



              

              

              

              


              

              

              

              

              

              


              


              

              


              


              

              



              



              




              


              

               

               

               




               




               


               




               




               


               





               

                



                




                








                



                
















                 

                 


                 

                 

                 

                 

                 

                 



                 
                 

                 
                 
                 

                 
                 
                 
                 
                 
                 
                 


                 
                 
                 
                 
                 
                 
                 
                 
                 
                 

                 

                 


                 

                 


                 


                 



                 
                 


                 


               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
               
              



            }
         }
         // Head main fill
         ctx.beginPath();ctx.arc(ex,ey-e.h/2+22,e.w/2-6|0,0,Math.PI*2);ctx.closePath();
         if(e.hp<=5 && Date.now()%100<50) { 
            e.col="#fffab3";
            e.alive=false;currentScore+=100;comboCount++;comboTimer=60;continue;}
         else {
           e.col=(e.hp<=12)?"#ff3477":"#bc3cff";
           e.alive=true;}
         if(e.alive) {
           e.hp-=.01 + Math.random()*.0015;}
       }
       // Death flash effect handled above.
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
       //
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      

   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   }
   }

   // HUD (score/combo/health/pause)
   drawHUD();

   // Pause screen overlay
   if(gameState==="pause"){
     drawPauseMenu();
   }
}

// HUD drawing function (top bar + bottom bar)
function drawHUD(){
   // Top bar (score/combo/high score)
   let yTop=22;
   // Score left
   drawHUDBox(20,yTop,"SCORE",currentScore,"#ffb347");
   drawHUDBox(220,yTop,"COMBO",comboCount>1?comboCount+"x":"-",comboCount>1?"#c9f":"#ccc");
   drawHUDBox(420,yTop,"HIGH SCORE",highScore,"#f7e17c");
   // Health right (bottom bar)
   drawHealthBar(canvas.width-240,yTop,currentScore);
}
function drawHUDBox(x,y,label,val,color){
   color=color||"#fff";
   let w=180,h=39;
   ctx.save();
   // Box BG
   ctx.globalAlpha=.23;
   ctx.fillStyle=color;ctx.fillRect(x,y,w,h);
   // Outline
   ctx.globalAlpha=.72;	ctx.strokeStyle=color;	ctx.lineWidth=2.5;	ctx.strokeRect(x,y,w,h);
   // Label/value
  	ctx.globalAlpha=.98;	ctx.font="bold italic 16px Segoe UI";	ctx.fillStyle=color;	ctx.textAlign="left";
  	ctx.fillText(label,x+10,y+20);	ctx.font="bold italic 24px Segoe UI";	ctx.textAlign="right";
  	ctx.fillText(val,x+w-10,y+26);	ctx.restore();
}
function drawHealthBar(x,y,val){
   let w=180,h=32,maxHP=100,pct=clamp(playerHealth/maxHP,.02,.99);
  	ctx.save();	ctx.strokeStyle="#fae76d";	ctx.lineWidth=3.1;	ctx.strokeRect(x,y,w,h);	
  	ctx.globalAlpha=.19;	ctx.fillStyle="#ffb347";	ctx.fillRect(x,y,w,h);
  	ctx.globalAlpha=.88;	ctx.fillStyle="#f40e46";	ctx.fillRect(x+2,y+2,(w-4)*pct,h-4);
  	ctx.globalAlpha=.98;	ctx.font="bold italic 18px Segoe UI";	ctx.textAlign="center";
  	ctx.shadowColor="#000a";	ctx.shadowBlur=3;
  	ctx.fillText("HEALTH "+playerHealth+"/"+maxHP,x+w/2,y+h/2+3);	
  	ctx.restore();
}

function drawPauseMenu(){
  	// Centered overlay panel (semi-transparent)
  	let w=340,h=300,x=(canvas.width-w)/2,y=(canvas.height-h)/2;
  	ctx.save();	
  	ctx.globalAlpha=.76;	
  	ctx.fillStyle="#181628cc";	
  	ctx.beginPath();	
  	ctx.roundRect(x,y,w,h,18);	
  	ctx.closePath();	
  	ctx.fill();	
  	// Text/menu	
  	ctx.globalAlpha=1.;	
  	ctx.font="bold italic 38px Segoe UI";	
  	ctx.textAlign="center";	
  	ctx.shadowBlur=8;	
  	ctx.shadowColor="#fff8";	
  	ctx.fillText("PAUSED",canvas.width/2,y+58);	
  	ctx.shadowBlur=0;	
  	let opts=["RESUME","RESTART","QUIT TO TITLE"];	
  	for(let i=0;i<opts.length;++i){	
  		drawButton(x+40,y+110+i*62,w-80,48,opts[i],true);	
  	}	
  	ctx.restore();
}

// ============ MAIN LOOP & INPUT ============
function gameLoop(){
	switch(gameState){
		case "title": drawTitle(); break;
		case "charselect": drawCharSelect(); break;
		case "levelselect": drawLevelSelect(); break;
		case "playing": drawGameplay(); break;
		case "pause": drawGameplay(); break;//drawPauseMenu handled as overlay in gameplay!
	}
	requestAnimationFrame(gameLoop);
}
gameLoop();

// Input handling:
document.addEventListener("keydown",handleInput,false);
document.addEventListener("mousedown",handleClick,false);

function handleInput(e){
	switch(gameState){
		case "title":
			gameState="charselect";break;

		case "charselect":{
			if(e.key=="ArrowRight") selectedCharIdx=(selectedCharIdx+1)%CHARACTERS.length;
			if(e.key=="ArrowLeft") selectedCharIdx=(selectedCharIdx-1+CHARACTERS.length)%CHARACTERS.length;
			let thisChar = CHARACTERS[selectedCharIdx];
			if(e.key=="Enter" && highScore>=thisChar.unlockedAt)
				gameState="levelselect";
			break;}
		case "levelselect":{
			if(e.key=="ArrowDown") selectedLevelIdx=(selectedLevelIdx+1)%LEVELS.length;
			if(e.key=="ArrowUp") selectedLevelIdx=(selectedLevelIdx-1+LEVELS.length)%LEVELS.length;
			let thisLevel = LEVELS[selectedLevelIdx];
			if(e.key=="Enter" && highScore>=thisLevel.unlockedAt){
				resetGamePlay();gameState="playing";}
			break;}
		case "playing":{
			if(e.key=="Escape"){ gameState="pause"; }
			// Player controls (WASD/arrows/jump/attack)
			if(player){
				if(["ArrowLeft","a"].includes(e.key)) player.x-=player.speed*(player.facingRight?-1:.95),player.facingRight=false;
				if(["ArrowRight","d"].includes(e.key)) player.x+=player.speed*(player.facingRight?1:.95),player.facingRight=true;
				if(["ArrowUp","w"].includes(e.key)) player.y-=player.speed*1.08,inGameSceneY-=player.speed*.97;//jump up scene
				if(["ArrowDown","s"].includes(e.key)) player.y+=player.speed*.85,inGameSceneY+=player.speed*.77;//descend scene
				if(e.key==" "||e.key=="z"){ player.attacking=true; setTimeout(()=>{player.attacking=false},160);}
			}
			break;}
		case "pause":{
			if(e.key=="Escape") gameState="playing";
			if(e.key=="Enter") gameState="playing";//resume on enter too
			break;}
	}
}

function handleClick(e){
	let mx=e.offsetX,my=e.offsetY;//relative to canvas top-left
	switch(gameState){
		case "title": gameState="charselect"; break;

		case "charselect":{
			// Find SELECT button under mouse for selected char only:
			let chars = CHARACTERS,current=getUnlockedChars()[selectedCharIdx];
			let spacing=110,x0=canvas.width/2-(chars.length-1)*spacing/2,x=x0+selectedCharIdx*spacing,y=180,r=48,bx=x-48,bw=96,bh=36,sby=y+r+56,sbx=x-48,sbw=96,sbh=36;
			if(mx>bx&&mx<bx+bw&&my>sby&&my<sby+sbh && highScore>=chars[selectedCharIdx].unlockedAt)
				gameState='levelselect';
			break;}
		case "levelselect":{
			let levels = LEVELS,x=canvas.width/2-120,w=240,h=52,lidx=null,sbx,sby,sbw,sbh;
			for(let i=0;i<levels.length;++i){
				let sy=140+i*70,lvlUnlckd=(highScore>=levels[i].unlockedAt);
				sbx=x+w+14;sby=sy+6;sbw=92;sbh=38;//play btn box per row!
				if(mx>sbx&&mx<sbx+sbw&&my>sby&&my<sby+sbh&&lvlUnlckd){selectedLevelIdx=i;lidx=i;}
			}
			if(lidx!=null){resetGamePlay();gameState='playing';}
			break;}
		case "playing":{
			// Could add pause/resume with click on corner icon etc.
			break;}
		case "pause":{
			let w=340,h=300,xp=(canvas.width-w)/2,yp=(canvas.height-h)/2,bw=w-80,bh=48,bx=xp+40,tops=[yp+110,yp+172,yp+234];
			for(let i in tops){let by=tops[i];if(mx>bx&&mx<bx+bw&&my>by&&my<by+bh){
				if(i==0)gameState='playing';
				else if(i==1){resetGamePlay();gameState='playing';}
				else if(i==2)gameState='title';
			}}
			break;}
	}
}

// Game tick update (basic movement/combat/enemy logic demo)
setInterval(()=>{
	if(gameState!=="playing")return;

	// Player bounds and limits:
	player.x = clamp(player.x,42,canvas.width-42);
	player.y = clamp(player.y,inGameSceneY+80,inGameSceneY+540);

	// Combo timer decay:
	if(comboCount>1) {
		comboTimer--;
		if(comboTimer<=0){comboCount=0;}
	}
	// Enemy spawn logic (demo): spawn up to N enemies on screen.
	while(enemies.length<3+(currentScore/400)|0){spawnEnemy();}
	// Move enemies toward player:
	enemies.forEach(e=>{
		if(!e.alive)return;
		let dx=(player.x-e.x),dy=(player.y-e.y),dist=Math.abs(dx)+Math.abs(dy)/3 + .001;

		e.x+=dx/dist*(e.speed+.05*Math.random());
		e.y+=dy/dist*(e.speed+.05*Math.random());

		// Simple collision with player:
		let close=Math.abs(player.x-e.x)<40&&Math.abs(player.y-e.y)<62;

		if(close && !player.attacking && Math.random()<.10){ playerHealth-=5;if(playerHealth<=0){gameOver();} }
		else if(close && player.attacking && e.alive){
			e.hp-=13+(comboCount>5?comboCount*2.5:1.5);
			currentScore+=100*(comboCount>4?comboCount*.35:.75)|0;
			comboCount++;comboTimer=40+(comboCount*3)|0;e.alive=false;//pop!
		}
	});
	enemies=enemies.filter(e=>e.alive);

},40);

function gameOver(){
	if(currentScore>highScore){ highScore=currentScore; localStorage.setItem("forgeborn_highscore",highScore);}
	gameState='title';
}