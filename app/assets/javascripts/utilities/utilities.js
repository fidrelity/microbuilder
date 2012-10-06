function bind(scope, fn) {
  
  if ( fn ) {
  
    return function() {
    
      fn.apply(scope, arguments);
    
    };
  
  }
  
};

function extend(destination, source) {
  
  for (var key in source) {
    
    if (source.hasOwnProperty(key)) {
      
      destination[key] = source[key];
      
    }
    
  }
  
  return destination;
  
};

function log() {
  
  console.log.apply(console, arguments);
  
};

function clamp( x, a, b ) {

  return x ? x < a ? a : x > b ? b : x : a;

};

function map( x, a1, a2, b1, b2 ) {

  return ( x  - a1 ) * ( b2 - b1 ) / ( a2 - a1 ) + b1;

};

function checkAngle( angle ) {
  
  if ( angle > Math.PI ) {
    
    angle -= 2 * Math.PI;
    
  } else if ( angle <= -Math.PI ) {
    
    angle += 2 * Math.PI;
    
  }
  
  return angle;
  
};

function rand( min, max ) {
  
  min = min || 0;
  max = max || 1;
  
  return Math.random() * (max - min) + min;
  
};

function randInt( min, max ) {
  
  return Math.floor( rand( min, max ) );
  
};

function randSign() {
  
  return Math.random() > 0.5 ? 1 : -1;
  
};

function randBool() {
  
  return Math.random() > 0.5;
  
};

function incrementString( str ) {
  
  var num, val = null, i = 0;
  
  if ( !str || !str.length ) {
    
    return '2';
    
  }
  
  do {
    
    num = parseInt( str.charAt( str.length - 1 ) );
    
    if ( isNaN( num ) ) {
      
      break;
      
    }
    
    str = str.slice( 0, -1 );
    
    val += num * Math.pow( 10, i++ );
    
  } while ( num === 9 );
  
  if ( val !== null ) {
    
    return str + ( val + 1 );
    
  }
  
  return str + '2';
  
};

function timeString( _seconds ) {
  
  var minutes = Math.floor( _seconds / 60 );
  
  _seconds -= minutes * 60;
  
  return ( minutes < 10 ? '0' : '' ) + minutes + ':' + ( _seconds < 10 ? '0' : '' ) + _seconds;
  
};

function rgbToHex( r, g, b ) {
  
  return '#' + ( ( 1 << 24 ) + ( r << 16 ) + ( g << 8 ) + b ).toString( 16 ).slice( 1 ).toUpperCase();
  
};

function bresenham( func, x1, y1, x2, y2 ) {
  
  var dx = Math.abs( x1 - x2 ),
    dy = -Math.abs( y1 - y2 ),
    sx = x1 < x2 ? 1 : -1,
    sy = y1 < y2 ? 1 : -1,
    e = dx + dy, e2;
 
  while ( true ) {
    
    func( x1, y1 );
    
    if ( x1 === x2 && y1 === y2 ) {
      
      break;
      
    }
    
    e2 = 2 * e;
    
    if ( e2 >= dy ) {
      
      e += dy;
      x1 += sx;
      
    }
    
    if ( e2 <= dx ) {
      
      e += dx;
      y1 += sy;
      
    }
    
  }
  
};

function ellipse( func, x0, y0, x1, y1 ) {
  
  var a = Math.abs( x0 - x1 ), 
    b = Math.abs( y0 - y1), 
    b1 = b & 1,
    dx = 4 * ( 1 - a ) * b * b, 
    dy = 4 * ( b1 + 1 ) * a * a,
    err = dx + dy + b1 * a * a,
    e2;
  
  if ( x0 > x1 ) {
  
   x0 = x1;
   x1 += a;
  
  }
  
  if (y0 > y1) {
    
    y0 = y1;
    
  }
  
  y0 += ( b + 1 ) / 2; 
  y1 = y0 - b1;
  
  a *= 8 * a;
  b1 = 8 * b * b;
  
  do {
    
    func( x1, y0, x0, y0 );
    func( x0, y1, x1, y1 );
    
    e2 = 2 * err;
    
    if ( e2 <= dy ) {
      
      y0++;
      y1--;
      err += dy += a;
      
    }
    
    if ( e2 >= dx || 2 * err > dy ) {
      
      x0++;
      x1--;
      err += dx += b1;
    
    }
    
  } while ( x0 <= x1 );
   
  while ( y0 - y1 < b ) {
    
    func( x0 - 1, y0, x1 + 1, y0++ );
    func( x0 - 1, y1, x1 + 1, y1-- );
    
  }
  
};

extend( CanvasRenderingContext2D.prototype, {
  
  drawLine : function( x, y, x2, y2 ) {
    
    this.beginPath();
    this.moveTo( x, y );
    this.lineTo( x2, y2 );
    this.stroke();
    
  },
  
  fillCircle : function( x, y, r ) {
    
    this.beginPath();
    this.arc( x, y, r, 0, Math.PI * 2, true );
    this.fill();
    
  },
  
  strokeCircle : function( x, y, r ) {
    
    this.beginPath();
    this.arc( x, y, r, 0, Math.PI * 2, true );
    this.stroke();
    
  },
  
  dashedTo : function( x, y, x2, y2, l ) {

    var A = x2 - x,
        B = y2 - y,
        C = Math.sqrt( A * A + B * B ),
        a = ( l * A ) / C,
        b = ( l * B ) / C,
        xD = a,
        yD = b,
        d = true;

    this.moveTo( x, y );

    while ( Math.abs( A ) > Math.abs( xD ) || Math.abs( B ) > Math.abs( yD ) ) {
    
      d ? this.lineTo( x + xD, y + yD ) : this.moveTo( x + xD, y + yD );

      d = !d;

      xD += a;
      yD += b;
    
    }
    
    this.lineTo( x2, y2 );
  
  },
  
  dashedLine : function( x, y, x2, y2, l ) {
    
    this.beginPath();
    this.dashedTo( x, y, x2, y2, l );
    this.stroke();
    
  },
  
  dashedRect : function( x, y, w, h, l ) {
    
    this.beginPath();
    
    this.dashedTo( x, y, x + w, y, l );
    this.dashedTo( x + w, y, x + w, y + h, l );
    this.dashedTo( x + w, y + h, x, y + h, l );
    this.dashedTo( x, y + h, x, y, l );
    
    this.stroke();
    
  },
  
  drawArrow : function( x, y, x2, y2, s ) {
    
    s = s || 1;
    
    this.drawLine(x, y, x2, y2);
    
    this.save();
    this.translate( x2, y2 );
    
    this.rotate( new Vector( x2 - x, y2 - y).angle() );
    this.scale( s, s );
    
    this.beginPath();
    
    this.moveTo( -20, 0 );
    this.lineTo( -25, -12 );
    this.lineTo( 1, 0 );
    this.lineTo( -25, 12 );
    
    this.closePath();
    
    this.fill();
    
    this.restore();
    
  },
  
  putImageDataOverlap : function( imageData, x, y ) {
    
    var i, j, p, a, b,
      data = imageData.data,
      width = imageData.width,
      height = imageData.height;
    
    this.save();
    
    this.translate( x, y );
    
    for ( i = 0; i < height; i++ ) {
      
      p = 0;
      a = i * width * 4;
      
      for ( j = 0; j < width; j++ ) {
        
        b = ( i * width + j ) * 4;
        
        if ( data[a] !== data[b] || data[a + 1] !== data[b + 1] || 
          data[a + 2] !== data[b + 2] || data[a + 3] !== data[b + 3] ) {
          
          this.fillStyle = 'rgba(' + data[a] + ',' + data[a+1] + ',' + data[a+2] + ',' + data[a+3] / 255 + ')';
          this.fillRect( p, i, j - p, 1 );
          
          p = j;
          a = ( i * width + p ) * 4;
          
        }
        
      }
      
      this.fillStyle = 'rgba(' + data[a] + ',' + data[a+1] + ',' + data[a+2] + ',' + data[a+3] / 255 + ')';
      this.fillRect( p, i, width - p, 1 );
      
    }
    
    this.restore();
    
  },
  
  cloneImageData : function( _imageData ) {
    
    var imageData = this.createImageData( _imageData ),
      i;
    
    for ( i = 0; i < _imageData.data.length; i++ ) {
      
      imageData.data[i] = _imageData.data[i];
      
    }
    
    return imageData;
    
  }
  
});

Array.prototype.forEachApply = function( fn, a ) {

  this.forEach( function( e ) {
    
    e[fn].call( e, a );
    
  });
  
};

Array.prototype.clone = function() {
  
  return this.concat();
  
};

Array.max = function( array ) {
  
  return Math.max.apply( Math, array );
  
};

Array.min = function( array ) {
  
  return Math.min.apply( Math, array );
  
};
