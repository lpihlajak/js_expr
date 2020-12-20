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


    // https://lodev.org/cgtutor/xortexture.html
    function createTexture(textureSize, tdata) {
        for (var x=0; x<textureSize; x++) {
            for (var y=0; y<textureSize; y++) {

                var pixelIndex = (y * textureSize + x) * 4;

                // XOR pattern
                var red = x^y;
                var green = x^y;
                var blue = x^y;

                // XOR pattern gives 0-255 out with size 256x256.
                // get output in range 0-255 by calculating factor for any size
                var factor = textureSize / width * 2;
                red /= factor;
                green /= factor;
                blue /= factor;

                tdata.data[pixelIndex] = red;     // Red
                tdata.data[pixelIndex+1] = green; // Green
                tdata.data[pixelIndex+2] = blue;  // Blue
                tdata.data[pixelIndex+3] = 255;   // Alpha
            }
        }
    }

 
    var imagedata = ctx.createImageData(width, height);

    function createImage(texdata,textureSize, offset) {
        // Loop over all of the pixels
        for (var x=0; x<width; x++) {
            for (var y=0; y<height; y++) {
                var u = x-width/2;
                var v = y-height/2;

                // Get the pixel index
                var pixelIndex = (y * width + x) * 4;

                var dist = Math.sqrt( Math.pow((u), 2) + Math.pow((v), 2) );

                var a = 128 * (Math.atan2(y - height / 2.0, x - width / 2.0) / Math.PI + 1.0);

                a = a + 182.5; // TODO: Why??

                var invDist = 1.0 / parseFloat(dist);
                invDist = invDist*20000;

                u = invDist+offset/10.0;
                v = a; //parseFloat(a)/Math.PI; //y;       // a/3.1415;

                u = Math.floor(u)%textureSize;
                v = Math.floor(v)%textureSize;

                var pixelIndex2 = (Math.abs(u) * textureSize + Math.abs(v)) * 4;

                imagedata.data[pixelIndex] =   texdata.data[pixelIndex2];     // Red
                imagedata.data[pixelIndex+1] = texdata.data[pixelIndex2+1]; // Green
                imagedata.data[pixelIndex+2] = texdata.data[pixelIndex2+2];  // Blue
                imagedata.data[pixelIndex+3] = 255;   // Alpha


/*
                // Get the pixel index
                var pixelIndex = (y * width + x) * 4;

                // Texture coordinates
                var u = x%textureSize;
                var v = y%textureSize;

                var pixelIndex2 = (v * textureSize + u) * 4;

                imagedata.data[pixelIndex] = texdata.data[pixelIndex2];     // Red
                imagedata.data[pixelIndex+1] = texdata.data[pixelIndex2+1]; // Green
                imagedata.data[pixelIndex+2] = texdata.data[pixelIndex2+2];  // Blue
                imagedata.data[pixelIndex+3] = 255;   // Alpha
*/

            }
        }
    }

    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);

        tframe = tframe % 4000;
        var textureSize = 512;
 
        if(tframe > 3000)
            textureSize = 64;
        else if(tframe > 2000)
            textureSize = 128;
        else if(tframe > 1000)
            textureSize = 256;
        else if(tframe > 0)
            textureSize = 512;

        var texData = ctx.createImageData(textureSize, textureSize);

        createTexture(textureSize, texData);

        // Create the image
        createImage(texData,textureSize, tframe);
 
        // Draw the image data to the canvas
        ctx.putImageData(imagedata, 0, 0);

    }
 
    // Call the main loop
    main(0);
};
