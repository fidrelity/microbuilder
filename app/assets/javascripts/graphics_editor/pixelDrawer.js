PixelDrawer = function(_canvas) {
  if(_canvas) {
    this.setCanvasContest(_canvas);
  }  
  else{
    this.canvas = null;
    this.context = null;
    this.imageData = null;
    this.data = null;
    this.dataWidth = 0;
    this.dataHeight = 0;
  }
}

PixelDrawer.prototype.setCanvasContext = function(_canvas) {
  this.canvas = _canvas;
  this.context = _canvas.getContext("2d");
}

PixelDrawer.prototype.putPixel = function (_x, _y, _color) {
  var color = this.checkIfParsedColor(_color);
  this.colorPixel(_x,_y,color);
}


PixelDrawer.prototype.fillRect = function(_x1,_y1, _x2, _y2, _color) {  
  var color = this.checkIfParsedColor(_color);
  
  var width = _x2-_x1;
  var height = _y2-_y1;
  
  for(var i = 0; i < Math.abs(width); i++) {
    for(var j = 0; j < Math.abs(height); j++) {
      if(width > 0){
        if(height > 0)
          this.colorPixel(_x1+i,_y1+j, color);
        else
          this.colorPixel(_x1+i,_y1-j, color);
      }
      else{
        if(height > 0)
          this.colorPixel(_x1-i,_y1+j, color);
        else
          this.colorPixel(_x1-i,_y1-j, color);
      }
    }
  }
}

PixelDrawer.prototype.drawRect = function(_x1,_y1, _x2, _y2, _color) {
    var color = this.checkIfParsedColor(_color);
    
    this.drawLine(_x1,_y1, _x1, _y2,color);
    this.drawLine(_x1,_y2, _x2, _y2,color);
    this.drawLine(_x2,_y2, _x2, _y1,color);
    this.drawLine(_x2,_y1, _x1, _y1,color);
}

PixelDrawer.prototype.drawCircle = function (_xc, _yc, _a, _b, _color)
{
    var color = this.checkIfParsedColor(_color);
    
    _a = Math.abs(_a-_xc);
    _b = Math.abs(_b-_yc);
      
    var x = 0, y = _b;
    var a2 = _a*_a;
    var b2 = _b*_b;
    var crit1 = -(a2/4 + _a%2 + b2);
    var crit2 = -(b2/4 + _b%2 + a2);
    var crit3 = -(b2/4 + _b%2);
    var t = -a2*y;
    var dxt = 2*b2*x, dyt = -2*a2*y;
    var d2xt = 2*b2, d2yt = 2*a2;
    
    while (y>=0 && x<=_a) {
        this.colorPixel(_xc+x, _yc+y, color);
        if (x!=0 || y!=0)
            this.colorPixel(_xc-x, _yc-y, color);
        if (x!=0 && y!=0) {
            this.colorPixel(_xc+x, _yc-y, color);
            this.colorPixel(_xc-x, _yc+y, color);
        }
        if (t + b2*x <= crit1 || t + a2*y <= crit3) {
            x++;
            dxt += d2xt;
            t += dxt;
        }
        else if (t - a2*y > crit2) {
            y--; 
            dyt += d2yt; 
            t += dyt;
        }
        else {
            x++;
            dxt += d2xt;
            t += dxt;
            y--; 
            dyt += d2yt; 
            t += dyt;
        }
    }
}

PixelDrawer.prototype.fillCircle = function ( _xc,  _yc,  _a,  _b, _color) {
    var color = this.checkIfParsedColor(_color);
  
    _a = Math.abs(_a-_xc);
    _b = Math.abs(_b-_yc);
    
    var x = 0, y = _b;
    var width = 1;
    var a2 = _a*_a;
    var b2 =_b*_b;
    var crit1 = -(a2/4 + _a%2 + b2);
    var crit2 = -(b2/4 + _b%2 + a2);
    var crit3 = -(b2/4 + _b%2);
    var t = -a2*y;
    var dxt = 2*b2*x, dyt = -2*a2*y;
    var d2xt = 2*b2, d2yt = 2*a2;
    
    while (y>=0 && x<=_a) {
        if (t + b2*x <= crit1 ||     
        t + a2*y <= crit3) {     
            x++;
            dxt += d2xt;
            t += dxt;
            width += 2;
        }
        else if (t - a2*y > crit2) { 
            this.drawLine(_xc-x, _yc-y,_xc-x+ width,_yc-y, color);
            if (y!=0)
                this.drawLine(_xc-x, _yc+y,_xc-x+ width,_yc+y, color);
            y--;
            dyt += d2yt; 
            t += dyt;
        }
        else {
            this.drawLine(_xc-x, _yc-y,_xc-x+ width,_yc-y, color);
            if (y!=0)
                this.drawLine(_xc-x, _yc+y,_xc-x+ width,_yc+y, color);
            x++;
            dxt += d2xt;
            t += dxt;
            
            y--;
            dyt += d2yt; 
            t += dyt;

            width += 2;
        }
    }
    if (_b == 0)
        this.drawLine(_xc-_a, _yc,_xc-_a+ 2*_a+1, _yc );
}
 
PixelDrawer.prototype.drawLine = function (_x1, _y1, _x2, _y2, _color, _width) {
   _width = _width || 1;
   var color = this.checkIfParsedColor(_color);
   
   var dx = Math.abs(_x2-_x1);
   var dy = Math.abs(_y2-_y1);
   var sx = 0;
   var sy = 0;
   
   if(_x1 < _x2) 
       sx = 1;
   else  
       sx = -1;
   if (_y1 < _y2)
       sy = 1;
   else 
       sy = -1;
   
   var err = dx-dy
 
   while(1) {
     if(_width == 1) {
        this.colorPixel(_x1,_y1,color);
     }
     else {
        var halfWidth = Math.floor(_width/2);
        this.fillRect(_x1-halfWidth, _y1-halfWidth, _x1+halfWidth, _y1+halfWidth, color);
     }
     if(_x1 == _x2 && _y1 ==_y2)
         break;
     var e2 = 2*err
     if(e2 > -dy) { 
       err = err - dy;
       _x1 = _x1 + sx;
     }
     if(e2 <  dx) { 
       err = err + dx;
       _y1 = _y1 + sy ;
     }
   }
}

PixelDrawer.prototype.colorPixel = function (_x,_y,_color) {
  if(_x >= 0 && _x < this.dataWidth && _y >= 0 && _y < this.dataHeight)
  {
    var colorIndex = ((_y*(this.dataWidth*4)) + (_x*4));

    this.data[colorIndex] = _color[0];
    this.data[colorIndex+1] = _color[1];
    this.data[colorIndex+2] = _color[2];
    this.data[colorIndex+3] = _color[3];
  }
}

PixelDrawer.prototype.getPixelColor = function(_x,_y) {
  var colorIndex = ((_y*(this.dataWidth*4)) + (_x*4));

  return [this.data[colorIndex],
          this.data[colorIndex+1],
          this.data[colorIndex+2],
          this.data[colorIndex+3]];
}

PixelDrawer.prototype.compareColor = function(_color1, _color2) {
  if(_color1[0] ==_color1[0] &&
     _color1[1] == _color2[1] &&
     _color1[2] == _color2[2] &&
     _color1[3] == _color2[3])
     return true;
   else
     return false;
}

PixelDrawer.prototype.floodFill = function(_x, _y,_newColor, _oldColor)
{
    _newColor = this.checkIfParsedColor(_newColor);
  
    if(_x >= 0 && _x < this.dataWidth && _y >= 0 && _y < this.dataHeight
      && this.compareColor(this.getPixelColor(_x,_y), _oldColor) &&
         !this.compareColor(this.getPixelColor(_x,_y), _newColor))
    {
        this.colorPixel(_x,_y, _newColor); //set color before starting recursion!

        this.floodFill(_x + 1, _y,     _newColor, _oldColor);       
        this.floodFill(_x - 1, _y,     _newColor, _oldColor);       
        this.floodFill(_x,     _y + 1, _newColor, _oldColor);
        this.floodFill(_x,     _y - 1, _newColor, _oldColor);              
    }    
}  

PixelDrawer.prototype.parseColor = function(_color) {
    
    if(_color.charAt(0)=="#") 
      _color = _color.substring(1);
    
    var colorArray = [parseInt(_color.substr(0,2), 16),
                 parseInt(_color.substr(2,2), 16),
                 parseInt(_color.substr(4,2), 16),
                 parseInt(_color.substr(6,2), 16)];
    
    if(!colorArray[3]) {
      colorArray[3] = 255;
    }
    return colorArray;
}

PixelDrawer.prototype.popImageData = function() {
  try{
    this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.data = this.imageData.data;
    this.dataWidth = this.imageData.width;
    this.dataHeight = this.imageData.height;
  }
  catch(e) {
    console.log("could not pop imageData, canvas was not set.")
  }
}

PixelDrawer.prototype.pushImageData = function() {
  this.imageData.data = this.data;
  this.context.putImageData(this.imageData, 0, 0);
}

PixelDrawer.prototype.checkIfParsedColor = function(_color) {
    if(!(_color instanceof Array)) 
      return( this.parseColor(_color));
    else
      return _color;
}