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

function randSign() {
  
  return Math.random() > 0.5 ? 1 : -1;
  
};

function randBool() {
  
  return Math.random() > 0.5;
  
};

function incrementString( str ) {
  
  if ( !str || !str.length ) {
    
    return '2';
    
  }
  
  var num = parseInt( str.charAt( str.length - 1 ) );
  
  if ( isNaN( num ) ) {
    
    str += '2';
    
  } else {
    
    str = str.slice(0, -1)
    str += num + 1;
    
  }
  
  return str;
  
}

extend( CanvasRenderingContext2D.prototype, {
  
  line : function( x, y, x2, y2 ) {
    
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
