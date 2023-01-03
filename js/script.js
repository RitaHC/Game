console.log('Linked')

//Trial 1
//Start-Game Function
//  const startGame = () => {
//      let startDiv = document.getElementById('start')
//      let canvas = document.getElementById('canvas1')
//      let collisionCanvas = document.getElementById('collisionCanvas')
//       startDiv.style.display = 'none'
//       gameCanvas.style.display = 'inline'
//       collisionCanvas.style.display = 'block'
//      start()
// }

const start = document.getElementById('start')
const canvas = document.getElementById('canvas1')
const collisionCanvas = document.getElementById('collisionCanvas')

//Trial -2
// const startOver = () = {
//     if( canvas.style.display === 'none' || collisionCanvas.style.display === 'none'){
//         canvas.style.display = 'block'
//         collisionCanvas.style.display = 'block'
//     } else{
//         canvas.style.display = 'none'
//         collisionCanvas.style.display = 'none'
//     }
//  }

//  start.addEventListener('click', startOver())


// Building Canvas 

const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight


const collisionCtx = collisionCanvas.getContext('2d')
collisionCanvas.width = window.innerWidth
collisionCanvas.height = window.innerHeight
ctx.font = '50px Impact'
let gameOver = false

let ravens = []

let timeToNextRaven = 0
let ravenInterval = 1300
let lastTime = 0
let score = 0



//Class of Ravens
class Raven {
    constructor(){
        this.spriteWidth = 271
        this.spriteHeight = 194
        this.sizeModifier =Math.random() * 0.6 + 0.4
        this.width = this.spriteWidth * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier
        this.x = canvas.width
        this.y = Math.random()*(canvas.height -  this.height)
        this.directionX = Math.random() * 5 + 3
        this.directionY = Math.random() * 5 -2.5 
        this.markedForDeletion = false
        this.image = new Image()
        this.image.src = 'raven.png'
        this.frame = 0
        this.maxFrame = 4
        this.timeSinceFlap = 0
        this.flapInterval = Math.random() * 50  + 50
        this.randomColors = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)]
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')'
        
    }

    update(deltaTime){
        // making canvas a boundary and creating bouncing effect
        if(this.y<0 || this.y > canvas.height-this.height){
            this.directionY = this.directionY * -1
        }
        this.x -= this.directionX
        this.y += this.directionY

        //filter out objects which are beyond the screen
        if (this.x < 0 - this.width) {
            this.markedForDeletion = true
        }

        //using delatTime to set equal intervals
        this.timeSinceFlap += deltaTime
        if(this.timeSinceFlap>this.flapInterval){
            if(this.frame > this.maxFrame) {
                this.frame = 0
            }else{
                this.frame++
                this.timeSinceFlap = 0
            }

            //Game-over consition
            if (this.x < 0-this.x){
                gameOver = true
            }
        }

        

    }
    draw(){
        // creating object box
        collisionCtx.fillStyle = this.color
        collisionCtx.fillRect(this.x, this.y, this.width, this.height)
        // creating sprite object inside a rectangle
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}


// Class Explosion and sound effects
let explosions = []
class Explosion {
    constructor (x,y,size){
        this.image = new Image()
        this.image.src = 'boom.png'
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.size = size
        this.x = x
        this.y = y
        this.frame = 0
        this.sound = new Audio()
        this.sound.src = 'boom.flac'
        this.timeSinceLastFrame = 0
        this.frameInterval = 100
        this.markedForDeletion = false
    }
    update(deltaTime){
        if (this.frame === 0) {
            this.sound.play()
        }
        this.timeSinceLastFrame +=deltaTime
        if(this.timeSinceLastFrame > this.frameInterval){
            this.frame++
            this.timeSinceLastFrame = 0
            if (this.frame > 5){
                this.markedForDeletion = true
            }
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y -this.size/4, this.size, this.size)
    }
}

//Score Function
const drawScore = () => {
    ctx.fillStyle = 'black'
    ctx.fillText('Score ' + score, 50, 75)
    ctx.fillStyle = 'white'
    ctx.fillText('Score ' + score, 55, 80)
   
} 
//Draw Game-Over 
const drawGameOver = () => {
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    ctx.fillText('GAME OVER, yourscore is' + score, canvas.width/2, canvas.height/2)
    ctx.fillStyle = 'white'
    ctx.fillText('GAME OVER, yourscore is' + score, canvas.width/2 + 5, canvas.height/2 + 5)
}

window.addEventListener('click', function (e){
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1,1)
    const pc = detectPixelColor.data
    console.log(detectPixelColor)
    ravens.forEach((e)=> {
        if(e.randomColors[0]===pc[0] && e.randomColors[1]===pc[1] && e.randomColors[2]===pc[2]){
            //Collision detected by color

            e.markedForDeletion = true
            score ++
            explosions.push(new Explosion(e.x, e.y, e.width))
            console.log(explosions)
        }
    })
})


//Animation Function 
const animate = (timestamp) =>{
    ctx.clearRect(0,0, canvas.width, canvas.height)
    collisionCtx.clearRect(0,0, canvas.width, canvas.height)
    let deltaTime = timestamp - lastTime
    lastTime = timestamp
    timeToNextRaven += deltaTime
    //Setting raven interval time 
    if (timeToNextRaven > ravenInterval){
        ravens.push(new Raven())
        timeToNextRaven = 0
    }
    drawScore();

    //Spread-Operator -> Spreading the array
    [...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion)
    explosions = explosions.filter(object => !object.markedForDeletion)
    if (!gameOver) {
        requestAnimationFrame(animate)
    } else{
        drawGameOver()
    }
}
animate(0)
