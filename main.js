




define([
        "dojo/_base/declare",
        "framework/PluginBase",
	//	"jquery",
		"dojo/parser",
		"dijit/registry",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/_base/lang",
		"dojo/query",
	//	"use!underscore", 
		"./CoastalDefense",
		"dojo/text!./CoastalDefense.json"
       ],
       function (declare, PluginBase, parser, registry, domClass, domStyle, lang, query, cd, configFile) {
           return declare(PluginBase, {
               toolbarName: "Coastal Defense",
               toolbarType: "sidebar",
			   showServiceLayersInLegend: true,
			   infoGraphic: "plugins/coastal_defense/CoastalDefense_gulfmex_20131021_FINAL_c.jpg",
               allowIdentifyWhenActive: false,
			   resizable: false,
			   width: 720,
			   height: 610,
			   
			   
               activate: function () { 

			   },
			   
               deactivate: function () { 
			   
			   
			   },
			   
               hibernate: function () { 
			   
				   //console.log(this.cdTool.profileLandPoints.visible);
				   //this.cdTool.profileLandPoints.hide();
				   //this.cdTool.marshLayer.hide();
				   //this.cdTool.dikeLayer.hide();
				   //this.cdTool.contours.hide();
				   //this.cdTool.habExtentLayer.hide();
				   this.cdTool.geoSelect();
				   
				   a = lang.hitch(this.cdTool,this.cdTool.destroyWidget);
				   
				   a();
				   		     
			   },
			   
               initialize: function (frameworkParameters) {
				   
				
				   declare.safeMixin(this, frameworkParameters); 
				   
	               var djConfig = {
	                   parseOnLoad: true
	               };
				   self = this;
				   
				   domClass.add(this.container, "claro");

				   //console.log(configFile);
				   this.cdTool = new cd(this.container, this.map, this.app, configFile);
				   console.log(this);
				   
				   this.cdTool.initialize(this.cdTool);
				   
			   },
				   
               getState: function () {
				   
				   // console.log(this.cdTool.startPanel);
				   // state = {
				   // 					   panel: this.cdTool.startPanel
				   // }
				   
				   //state = 'test';
				   
				  
				   console.log(this.cdTool);
				   
				   this.cdTool.getPanelParameters();
				   
				   state = this.cdTool.parameters;
				   
				   console.log(state);
				   
				   return state
				   
	 		   	},
				
               setState: function (state) { 
				    
					this.cdTool.parameters = state;
					
					parentContainer = this.container.parentElement;

					parentContainer.style.display = 'block';
					
					this.cdTool.resetState();
					
					parentContainer.style.display = 'none';
					
				   		   

					
			   },
			   
			   identify: function(){
				   console.log(dojo.query(".identify-info-window")); dojo.query(".identify-info-window").addClass("CD_HidePopup");
			   }
           });
       });
