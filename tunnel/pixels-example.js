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
    var texdata = ctx.createImageData(256,256);

    function createTexture(offset) {
        // Loop over all of the pixels
        for (var x=0; x<256; x++) {
            for (var y=0; y<256; y++) {

                // Get the pixel index
                var pixelIndex = (y * width + x) * 4;

                // XOR pattern
                var red = ((x+offset) % 256) ^ ((y+offset) % 256);
                var green = ((x+offset) % 256) ^ ((y+offset) % 256);
                var blue = ((x+offset) % 256) ^ ((y+offset) % 256);


                // Set the pixel data
                texdata.data[pixelIndex] = red;     // Red
                texdata.data[pixelIndex+1] = green; // Green
                texdata.data[pixelIndex+2] = blue;  // Blue
                texdata.data[pixelIndex+3] = 255;   // Alpha
            }
        }
    }

    createTexture(1234);
 
    // Create an ImageData object
    var imagedata = ctx.createImageData(width, height);
 
    // Create the image
    function createImage(offset) {
        // Loop over all of the pixels
        for (var x=0; x<width; x++) {
            for (var y=0; y<height; y++) {
                var u = x-width/2;
                var v = y-height/2;

                // Get the pixel index
                var pixelIndex = (y * width + x) * 4;

                var dist = Math.sqrt( Math.pow((u), 2) + Math.pow((v), 2) );
 
                var a = 0.5 * 256 * Math.atan2(y - height / 2.0, x - width / 2.0) / Math.PI;

                a = a + 182.5; // TODO: Why??

                var invDist = 1.0 / parseFloat(dist);
                invDist = invDist*20000;

                u = invDist+offset/10.0;
                v = a; //parseFloat(a)/Math.PI; //y;       // a/3.1415;

                u = Math.round(u)%64;
                v = Math.round(v)%64;

                var pixelIndex2 = (Math.abs(u) * width + Math.abs(v)) * 4;

                imagedata.data[pixelIndex] =   texdata.data[pixelIndex2];     // Red
                imagedata.data[pixelIndex+1] = texdata.data[pixelIndex2+1]; // Green
                imagedata.data[pixelIndex+2] = texdata.data[pixelIndex2+2];  // Blue
                imagedata.data[pixelIndex+3] = 255;   // Alpha

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
