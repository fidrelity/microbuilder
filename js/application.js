Paint = function(_canvas) {
    this.canvasObject = $(_canvas);
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');

    this.isPaint;

    this.clickX = new Array();
    this.clickY = new Array();
    this.clickDrag = new Array();

    this.color;
    this.clickColor = new Array();

    this.lineSizes = new Array();
    this.lineWidth;

    this.init();
};

// ----------------------------------------
Paint.prototype.init = function() {
    this.color = "#df4b26";
    this.isPaint = false;
    this.lineWidth = 5;

    // Events
    this.canvasObject.mousedown($.proxy(this.mouseDown, this));
    this.canvasObject.mousemove($.proxy(this.mouseMove, this));
    this.canvasObject.mouseup($.proxy(this.mouseUp, this));
    this.canvasObject.mouseleave($.proxy(this.mouseUp, this));
};

// ----------------------------------------
Paint.prototype.mouseDown = function(e) {
    this.isPaint = true;
    this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
    this.redraw();
};

// ----------------------------------------
Paint.prototype.mouseMove = function(e) {
    if(this.isPaint){
        this.addClick(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop, true);
        this.redraw();
    }
};

// ----------------------------------------
Paint.prototype.mouseUp = function(e) {
    this.isPaint = false;
};

// ----------------------------------------
Paint.prototype.setColor = function(_color) {
    if(!_color) return false;
    this.color = _color;
};

// ----------------------------------------
Paint.prototype.setSize = function(_size) {
    if(!_size) return false;
    this.lineWidth = _size;
};
// ----------------------------------------
Paint.prototype.clearCanvas = function(_reset) {
    this.canvas.width = this.canvas.width;

    if(_reset) {
        isPaint = false;
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.clickColor = [];
        this.lineSizes = [];
    }
};

// ----------------------------------------
Paint.prototype.redraw = function() {
    this.clearCanvas();
    this.context.lineJoin = "round";

    for(var i=0; i < this.clickX.length; i++)
    {
        this.context.beginPath();
        if(this.clickDrag[i] && i){
            this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
        } else {
            this.context.moveTo(this.clickX[i]-1, this.clickY[i]);
        }
        this.context.lineTo(this.clickX[i], this.clickY[i]);
        this.context.closePath();
        this.context.strokeStyle = this.clickColor[i];
        this.context.lineWidth = this.lineSizes[i];
        this.context.stroke();
    }
};

// ----------------------------------------
Paint.prototype.undo = function() {
    var start = this.undoArray[this.undoArray.length-1][0];
    var end   = this.undoArray[this.undoArray.length-1][1];

    this.clickX.splice(start, end);
    this.clickY.splice(start, end);

    this.undoArray.pop();

    this.redraw();
};

// ----------------------------------------
Paint.prototype.addClick = function(_x, _y, _dragging) {
    this.clickX.push(_x);
    this.clickY.push(_y);
    this.clickDrag.push(_dragging);
    this.clickColor.push(this.color);
    this.lineSizes.push(this.lineWidth);
};

// ----------------------------------------
Paint.prototype.saveImage = function(_speech, _author) {

    if(this.clickX.length < 50) {
        alert("Sorry, but it seems you didn't draw something!"); return false;
    }
    if(!_author) {
        alert("Please enter your name!"); return false;
    }
    if(!_speech) {
        $("#speechName").addClass("ui-state-error"); return false;
    }

    //var img = this.canvas.toDataURL("image/png");
    //document.write('<img src="'+img+'"/>');

    /*
    var imageData = this.context.getImageData();
    $.post('/upload',
    {
            speech : _speech,
            author : _author,
            img : this.canvas.toDataURL('image/jpeg')
    },
    function(data) {});
    */
};

// ----------------------------------------
$(document).ready(function() {

    var paint = new Paint('#canvas');

    $('#clearCanvasButton').click(function(){
        paint.clearCanvas(true);
    });

    $('.colorBlock').click(function(){
        paint.setColor($(this).prop("id"));

        $('.colorBlock').removeClass("activeColor");
        $(this).addClass("activeColor");
    });

    $('.sizeBlock').click(function(){
        paint.setSize($(this).prop("id"));

        $('.sizeBlock').removeClass("activeColor");
        $(this).addClass("activeColor");
    });

    $('#saveButton').click(function() {

        var speech = $("#speechName").val();

        paint.saveImage(speech);
    });

    $("#sizeSlider").slider({
            value:5,
            min: 1,
            max: 40,
            step: 1,
            change: function( event, ui ) {
                paint.setSize(ui.value);
            }
        });
});