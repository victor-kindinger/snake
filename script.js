const canvas = document.querySelector('canvas');
canvas.width = 550;
canvas.height = 550;
const c = canvas.getContext('2d');

c.textAlign = 'center';
c.textBaseline = 'middle';
c.lineWidth = 1.5;

var currentTime = new Date();
var lastTime = new Date();
frameDuration = 200; //in milliseconds.
var x = [250];
var y = [250];
var _moveTo = '';
var direction = '';
var gameOver = false;
var newRecord = false;
var snakeSize = 1;
var fruitX = Math.floor(Math.random() * 11) * 50;
var fruitY = Math.floor(Math.random() * 11) * 50;


if (localStorage.getItem('record') == null) localStorage.setItem('record', '1');
animate();

function animate()
{
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height)

    //Fruit
    c.fillStyle = 'yellow';
    c.fillRect(fruitX, fruitY, 50, 50);

    //Movement update
    currentTime = new Date();
    if (currentTime.getTime() - lastTime.getTime() > frameDuration)
    {
        lastTime = currentTime;
        if (!gameOver) move();
    }
    
    //Snake body draw
    for (var i = 2; i < snakeSize + 1; i++)
    {
        var color = (i - 1) * (195 / snakeSize);
        c.fillStyle = `rgb(0, ${60 + color}, 0)`;
        c.fillRect(x[x.length - i] , y[y.length - i] , 50, 50);
    }

    //Snake head draw
    if (!gameOver) c.fillStyle = `rgb(0, ${50}, 0)`;
    else c.fillStyle = 'red';
    c.fillRect(x[x.length - 1] , y[y.length - 1] , 50, 50);

    //Collision
    if (x.length > snakeSize) x.shift();
    if (y.length > snakeSize) y.shift();
    var coordinates = [];
    for (var i = 0; i < x.length; i++) coordinates.push(`${x[i]} ${y[i]}`);
        
    for (var j = 0; j < coordinates.length; j++)
    {
        var coordinatesComparison = coordinates.slice(coordinates.indexOf(coordinates[j]));
        for (var i = 1; i < coordinatesComparison.length; i++)
        {
            if (coordinates[j] == coordinatesComparison[i]) gameOver = true;
        }
    }

    //Game over
    if (gameOver)
    {
        c.font = '72px serif';
        c.fillStyle = 'red';
        c.fillText('Game Over', 275, 225);
        c.strokeStyle = 'black';
        c.strokeText('Game Over', 275, 225);

        c.font = '50px serif';
        if (parseInt(localStorage.getItem('record')) < snakeSize)
        {
            newRecord = true;
            localStorage.setItem('record', snakeSize);
        }

        if (newRecord)
        {
            c.fillText(`New record!`, 275, 335);
            c.strokeText(`New record!`, 275, 335);
        }

        c.fillText(`Highest record: ${localStorage.getItem('record')}`, 275, 283);
        c.strokeText(`Highest record: ${localStorage.getItem('record')}`, 275, 283);
    }

    //Score
    c.font = '50px serif';
    c.fillStyle = 'yellow';
    c.fillText(snakeSize, 500, 50);
    c.strokeStyle = 'rgb(0, 60, 0)';
    c.strokeText(snakeSize, 500, 50)
}

function move()
{
    //Fruit eat
    if (x[x.length - 1] == fruitX && y[y.length - 1] == fruitY)
    {
        snakeSize++;
        var tryAgain = true;
        while (tryAgain)
        {
            fruitX = Math.floor(Math.random() * 11) * 50;
            fruitY = Math.floor(Math.random() * 11) * 50;

            var coordinates = [];
            for (var i = 0; i < x.length; i++) coordinates.push(`${x[i]} ${y[i]}`);

            if (!coordinates.includes(`${fruitX} ${fruitY}`)) tryAgain = false;
        }   
    }

    //Change direction
    if (_moveTo == 'right') {x.push(x[x.length - 1] + 50); y.push(y[y.length - 1]); direction = 'right';}
    if (_moveTo == 'left' ) {x.push(x[x.length - 1] - 50); y.push(y[y.length - 1]); direction = 'left';}
    if (_moveTo == 'up')    {y.push(y[y.length - 1] - 50); x.push(x[x.length - 1]); direction = 'up';}
    if (_moveTo == 'down')  {y.push(y[y.length - 1] + 50); x.push(x[x.length - 1]); direction = 'down';}   

    //Sides teleportation        
    if (x[x.length - 1] == 550) x[x.length - 1] = 0;
    if (x[x.length - 1] == -50) x[x.length - 1] = 500;
    if (y[y.length - 1] == 550) y[y.length - 1] = 0;
    if (y[y.length - 1] == -50) y[y.length - 1] = 500;
}

addEventListener('keydown', e =>
{
    if (e.key == 'ArrowRight' && direction != 'left')  _moveTo = 'right';
    if (e.key == 'ArrowLeft' && direction != 'right') _moveTo = 'left';
    if (e.key == 'ArrowDown' && direction != 'up')    _moveTo = 'down';
    if (e.key == 'ArrowUp' && direction != 'down')  _moveTo = 'up';
})