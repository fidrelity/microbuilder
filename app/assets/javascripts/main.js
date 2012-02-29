$(document).ready(function() {
   
   window.App = Ember.Application.create();
    
    // The top level layout
    App.main = Ember.View.create({
      templateName: 'templates_main_template'
    });
    
    App.routeManager = Ember.RouteManager.create({
      
      rootView: App.main,
      
      home: Ember.LayoutState.create({
         viewClass: HomeView
      }),
      
      gallery: Ember.LayoutState.create({
          route: 'gallery',
          viewClass: GalleryView
      }),
      
      profile: Ember.LayoutState.create({
          route: 'profile',
          viewClass: ProfileView
      }),
      
      about: Ember.LayoutState.create({
          route: 'about',
          viewClass: AboutView
      }),
      
      editor: Ember.LayoutState.create({
          route: 'editor',
          viewClass: EditorView,

          general: Ember.LayoutState.create({
              route: 'general',
              viewClass: GeneralView
          }),

          paint: Ember.LayoutState.create({
              route: 'paint',
              viewClass: PaintView
          }),

          placement: Ember.LayoutState.create({
              route: 'placement',
              viewClass: PlacementView
          }),

          behaviour: Ember.LayoutState.create({
              route: 'behaviour',
              viewClass: BehaviourView
          }),

          library: Ember.LayoutState.create({
              route: 'library',
              viewClass: LibraryView
          })
        
      })
      
   });

   App.main.appendTo('#content');

   //App.editorController = EditorController.create();

});