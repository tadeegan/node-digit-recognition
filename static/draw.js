(function() {
    // Creates a new canvas element and appends it as a child
    // to the parent element, and returns the reference to
    // the newly created canvas element

    var size = 28;
    var canvas;
    function createCanvas(parent, width, height) {
        var canvas = {};
        canvas.node = document.createElement('canvas');
        canvas.context = canvas.node.getContext('2d');
        canvas.node.width = width || 100;
        canvas.node.height = height || 100;
        parent.appendChild(canvas.node);
        return canvas;
    }
    var data = [];
    for(var i = 0; i < size*size; i++){
        data.push(0);

    }
    console.log(data.length);
    function init(container, width, height, fillColor) {
        canvas = createCanvas(container, width, height);
        var ctx = canvas.context;
        // define a custom fillCircle method
        ctx.fillCircle = function(x, y, radius, fillColor) {
            this.fillStyle = fillColor;
            this.beginPath();
            this.moveTo(x, y);
            this.arc(x, y, radius, 0, Math.PI * 2, false);
            this.fill();
        };
        ctx.clearTo = function(fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(0, 0, width, height);
        };
        ctx.clearTo(fillColor || "#000");

        // bind mouse events
        canvas.node.onmousemove = function(e) {
            if (!canvas.isDrawing) {
               return;
            }
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;

            data[y*size + x] = 255;
            var radius = 2; // or whatever
            var fillColor = '#fff';
            ctx.fillCircle(x, y, radius, fillColor);
        };
        canvas.node.onmousedown = function(e) {
            canvas.isDrawing = true;
        };
        canvas.node.onmouseup = function(e) {
            canvas.isDrawing = false;
        };
    }

    function get_image_data(){
        var imgData=canvas.context.getImageData(0,0,28,28);
        console.log(imgData.data.length);
        var reds = [];
        for(var i = 0; i < imgData.data.length; i++){
            if(i%4 == 0){
                reds.push(imgData.data[i]);
            }
        }
        console.log(reds);
        return reds;
    }

    var container = document.getElementById('canvas');
    init(container, size, size, '#000');

    $( document ).ready(function(){
        $("#submit").click(function(){
            console.log(data);
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify({"pixels": get_image_data()}),
                dataType: 'json',
                success: function(data){
                    alert(data);
                },
                error: function(){
                    //app.log("Device control failed");
                },
                processData: false,
                type: 'POST',
                url: 'classify'
            });
        });
    });


})();