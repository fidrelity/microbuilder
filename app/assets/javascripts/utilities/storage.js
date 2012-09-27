var Storage = {

  storage : null,

  init : function() {

    this.storage = window.localStorage || {

      storage : {},

      setItem : function( key, value ) {

        this.storage[key] = value.toString();

      },

      getItem : function( key ) {

        return this.storage[key];

      },

      clear : function() {

        this.storage = {};

      }

    };

  },

  read : function( key ) {

    if ( !this.storage ) {
      
      this.init();
      
    }

    return this.storage.getItem( key );

  },

  write : function( key, value ) {

    if ( !this.storage ) {

      this.init();

    }

    this.storage.setItem( key, value );

  }

};