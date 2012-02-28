var StateMachine = function( scope ) {

  this.scope = scope;
  
  this.currentState = new this.State();
  
  this.states = {};
  this.transitions = {};

}

StateMachine.prototype = {
  
  State : function( params ) {

    params = params || {};
  
    this.name = params.name || 'none';
  
    this.enter = params.enter || function() {};
    this.update = params.update || function( dt ) {};
    this.draw = params.draw || function( ctx ) {};
    this.exit = params.exit || function() {};

  },

  Transition : function( params ) {
    
    params = params || {};
    
    this.name = params.name || 'none';
    this.from = params.from || 'none';
    this.to = params.to || 'none';
    this.callback = params.callback || function() {};
  
  },
  
  init : function( params ) {
    
    var i,
        states = params.states instanceof Array ? params.states : [];
        transitions = params.transitions instanceof Array ? params.transitions : [];
    
    for ( i = 0; i < states.length; i++ ) {
      
      this.addState( new this.State( states[i] ) );
      
    }
    
    for ( i = 0; i < transitions.length; i++ ) {
      
      this.addTransition( new this.Transition( transitions[i] ) );
      
    }
    
    if ( this.states[params.initial] ) {
    
      this.changeState( params.initial );
    
    }
    
  },
  
  update : function( dt ) {
    
    this.currentState.update.call(this.scope, dt);
    
  },
  
  draw : function( ctx ) {
    
    this.currentState.draw.call(this.scope, ctx);
    
  },
  
  addState : function( state ) {
    
    this.states[state.name] = state;
    
  },
  
  addTransition : function( transition ) {
    
    var App = this;
    
    this.transitions[transition.name] = transition;
    
    this[transition.name] = function() {
      
      if ( App.currentState.name !== transition.to &&
        ( App.currentState.name === transition.from || transition.from === '*' ) ) {
        
        App.changeState( transition.to, transition.callback, arguments );
        
        return true;
        
      }
      
      return false;
      
    }
    
  },
  
  changeState : function( name, callback, arguments ) {
    
    this.currentState.exit.call( this.scope );
    
    if ( callback ) {
    
      // callback.apply( this.scope, arguments );
      callback.call( this.scope, this );
      
    }
    
    this.currentState = this.states[name];
    
    this.currentState.enter.call( this.scope );
    
  },
  
  hasState : function( name ) {
    
    return this.currentState.name === name;
    
  }
  
};


// example

// var Blob = {
//   
//   init : function() {
//     
//     this.fsm = new StateMachine( this );
//     
//     this.fsm.init( {
//       initial : 'green',
//       states : [
//         { name : 'green', draw : this.drawGreen, update : function(fsm) { console.log("update green"); } },
//         { name : 'red',   draw : this.drawRed,   exit : function(fsm) { console.log("exit red"); } },
//         { name : 'blue',  draw : this.drawBlue,  enter : function(fsm) { console.log("enter blue"); } }
//       ],
//       transitions : [
//         { name : "heat", from : 'green', to: 'red', callback : function(fsm) { console.log("heat-transition"); } },
//         { name : "cool", from : 'red', to: 'blue' },
//         { name : "grow", from : '*', to: 'green' }
//       ]
//     });
//     
//   },
//   
//   update : function(dt) {
//     
//     this.fsm.update(dt);
//     
//   },
//   
//   draw : function(ctx) {
//     
//     this.fsm.draw(ctx);
//     
//   },
//   
//   drawGreen : function(fsm, ctx) {
//     
//     this.drawBlob(ctx);
//     
//   },
// 
//   drawRed : function(fsm, ctx) {
//     
//     this.drawBlob(ctx);
//     
//   },
//   
//   drawBlue : function(fsm, ctx) {
//     
//     this.drawBlob(ctx);
//     
//   },
//   
//   drawBlob : function(ctx) {
//     
//     ctx.drawCircle(10, 10, 5);
//     
//   }
//   
// };
