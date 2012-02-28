$(document).ready(function() {
   
   window.App = Ember.Application.create();
    
    // Small LayoutState extension to toggle the navigation css
    App.NavState = Em.LayoutState.extend({
        navSelector: 'ul',
          enter: function(stateManager, transition) {
            this._super(stateManager, transition);
          }
    });
    
    App.SubNavState = App.NavState.extend({
        
    });
    
    // The top level layout
    App.main = Em.View.create({
      templateName: 'templates_main_template'
    });
    
    App.routeManager = Em.RouteManager.create({
        
      rootView: App.main,
      
      home: App.NavState.create({
         selector: '.home',
         viewClass: Em.View.extend({
         templateName: 'templates_home_template'
         })
      }),
      
      gallery: App.NavState.create({
          selector: '.gallery',
          route: 'gallery',
          viewClass: Em.View.extend({
            templateName: 'templates_gallery_template'
          })
      }),
      
      profile: App.NavState.create({
          selector: '.profile',
          route: 'profile',
          viewClass: Em.View.extend({
              templateName: 'templates_profile_template'
          })
      }),
      
      about: App.NavState.create({
          selector: '.about',
          route: 'about',
          viewClass: Em.View.extend({
              templateName: 'templates_about_template'
          })
      }),
      
      editor: App.NavState.create({
          selector: '.editor',
          route: 'editor',
          viewClass: Em.View.extend({
              templateName: 'templates_editor_template'
          })
      })
   });

   App.main.appendTo('body');
});