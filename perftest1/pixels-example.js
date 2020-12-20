// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and ctx
    var canvas = document.getElementById("viewport"); 
    var ctx = canvas.getContext("2d");
 
    // Define the image dimensions
    var width = canvas.width;
    var height = canvas.height;
    ctx.strokeStyle = "#2222222";
    ctx.lineWidth = 2;


var filterStrength = 20;
var frameTime = 0, lastLoop = 0, thisLoop;
var fpsOut = 0;


    function main(tFrame) {

    var thisFrameTime = (thisLoop=tFrame) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
    fps = (1000/frameTime).toFixed(1);

    xStep = canvas.width/16;
    yStep = canvas.height/16;
    console.log(xStep);

    for (var x=0; x<canvas.width; x = x+xStep) {
        for (var y=0; y<canvas.height; y = y+yStep) {
            ctx.fillStyle= `rgb(${(x+y)-tFrame/10%1024},0,0)`;    // color of fill
            ctx.fillRect(x,y,x+xStep,y+yStep);
            for(var i = 0; i<499999; i++); // busyloop to slow fps down
        }
    }

    ctx.font = "30px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("FPS: "+fps, 10, 50); 


    requestAnimationFrame(main);
}
main(0);


};
