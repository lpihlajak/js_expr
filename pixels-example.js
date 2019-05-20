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

    // mouse events
        // Set up mouse events for drawing
        var drawing = false;
        var mousePos = { x:0, y:0 };
        var lastPos = mousePos;
        canvas.addEventListener("mousedown", function (e) {
                drawing = true;
                lastPos = getMousePos(canvas, e);
        }, false);
        canvas.addEventListener("mouseup", function (e) {
                drawing = false;
        }, false);
        canvas.addEventListener("mousemove", function (e) {
                mousePos = getMousePos(canvas, e);
        }, false);

        // Set up touch events for mobile, etc
        canvas.addEventListener("touchstart", function (e) {
                mousePos = getTouchPos(canvas, e);
                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousedown", {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
        }, false);
        canvas.addEventListener("touchend", function (e) {
                var mouseEvent = new MouseEvent("mouseup", {});
                canvas.dispatchEvent(mouseEvent);
        }, false);
        canvas.addEventListener("touchmove", function (e) {
                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousemove", {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                });
                canvas.dispatchEvent(mouseEvent);
        }, false);

        // Prevent scrolling when touching the canvas
        document.body.addEventListener("touchstart", function (e) {
                if (e.target == canvas) {
                        e.preventDefault();
                }
        }, false);
        document.body.addEventListener("touchend", function (e) {
                if (e.target == canvas) {
                        e.preventDefault();
                }
        }, false);
        document.body.addEventListener("touchmove", function (e) {
                if (e.target == canvas) {
                        e.preventDefault();
                }
        }, false);

        // Get the position of the mouse relative to the canvas
        function getMousePos(canvasDom, mouseEvent) {
                var rect = canvasDom.getBoundingClientRect();
                return {
                        x: mouseEvent.clientX - rect.left,
                        y: mouseEvent.clientY - rect.top
                };
        }

        // Get the position of a touch relative to the canvas
        function getTouchPos(canvasDom, touchEvent) {
                var rect = canvasDom.getBoundingClientRect();
                return {
                        x: touchEvent.touches[0].clientX - rect.left,
                        y: touchEvent.touches[0].clientY - rect.top
                };
        }

        // Draw to the canvas
        function renderCanvas() {
                if (drawing) {
                        ctx.moveTo(lastPos.x, lastPos.y);
                        ctx.lineTo(mousePos.x, mousePos.y);
                        ctx.stroke();
                        lastPos = mousePos;
                }
        }

 
    // Create an ImageData object
    var imagedata = ctx.createImageData(width, height);
 
    // Create the image
    function createImage(offset) {
        // Loop over all of the pixels
        for (var x=0; x<width; x++) {
            for (var y=0; y<height; y++) {
                // Get the pixel index
                var pixelindex = (y * width + x) * 4;
 
                // Generate a xor pattern with some random noise
                var red = ((x+offset) % 256) ^ ((y+offset) % 256);
                var green = ((2*x+offset) % 256) ^ ((2*y+offset) % 256);
                var blue = 50 + Math.floor(Math.random()*100);
 
                // Rotate the colors
                blue = (blue + offset) % 256;
 
                // Set the pixel data
                imagedata.data[pixelindex] = red;     // Red
                imagedata.data[pixelindex+1] = green; // Green
                imagedata.data[pixelindex+2] = blue;  // Blue
                imagedata.data[pixelindex+3] = 255;   // Alpha
            }
        }
    }
 
    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);
 
        // Create the image
        createImage(Math.floor(tframe / 10));
 
        // Draw the image data to the canvas
        ctx.putImageData(imagedata, 0, 0);
        renderCanvas();
    }
 
    // Call the main loop
    main(0);
};
