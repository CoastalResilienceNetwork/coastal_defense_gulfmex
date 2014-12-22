//

define([
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./cdui.html", 
	"dojo/dom-style", 
	"dojo/dom-class", 
	"dojo/_base/fx", 
	"dojo/_base/lang",
	"dijit/registry",
	"dojox/lang/functional", 
	"dojo/on",
	"dojo/_base/Color",
	"dojox/charting/SimpleTheme",
	"dojo/parser",
	"dijit/form/HorizontalSlider",
	"dojo/query",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojox/charting/Chart", 
	"dojox/charting/axis2d/Default", 
	"dojox/charting/plot2d/Areas",
	"dojox/charting/plot2d/Lines",
	"dojox/charting/widget/Legend",
	"dojo/_base/array",
	"dijit/form/CheckBox",
	
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/geometry/Polyline",
	"esri/geometry/Point",
	"esri/symbols/PictureMarkerSymbol",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/graphic",
	"esri/SpatialReference",
	"esri/graphicsUtils",

	"esri/layers/DynamicLayerInfo",
	"esri/layers/QueryDataSource",
	"esri/layers/LayerDataSource",
	"esri/tasks/QueryTask",
	"esri/tasks/query",
	"esri/tasks/Geoprocessor",
			
	"dijit/layout/BorderContainer", 
	"dijit/layout/TabContainer", 
	"dijit/layout/AccordionContainer", 
	"dijit/layout/ContentPane", 
	"dijit/layout/AccordionPane",
	"dijit/TitlePane",
	"dijit/form/RadioButton",
	"dijit/form/Button",
	"dijit/form/TextBox",
	"dijit/form/Select"
	],
   function(
    declare, 
    WidgetBase, 
    TemplatedMixin, 
    template, 
    domStyle, 
    domClass, 
    baseFx, 
    lang,
	registry,
    functional, 
    on,
	Color,
	SimpleTheme,
	parser,
	HorizontalSlider,
	q,
	dom,
	domConstruct,
	domAttr,
	Chart, 
	Default, 
	Areas,
	Lines,
	Legend,
	array,
	CheckBox,
	ArcGISDynamicMapServiceLayer,
	Polyline,
	Point,
	PictureMarkerSymbol,
	SimpleMarkerSymbol,	
	SimpleLineSymbol,
	Graphic,
	SpatialReference,
	graphicsUtils,
	DynamicLayerInfo,
	QueryDataSource,
	LayerDataSource,
	QueryTask,
	esriQuery,
	Geoprocessor,
	BorderContainer, 
	TabContainer, 
	AccordionContainer, 
	ContentPane
	
    ){
        return declare([WidgetBase, TemplatedMixin], {
           
            // Some default values for our author
            // These typically map to whatever you're handing into the constructor
            name: "No Name",
            // Using require.toUrl, we can get a path to our AuthorWidget's space
            // and we want to have a default avatar, just in case
            //avatar: require.toUrl("custom/AuthorWidget/images/defaultAvatar.png"),
            bio: "",
 
            // Our template - important!
            templateString: template,
 
            // A class to be applied to the root node in our template
            baseClass: "cdui",
            
 
            // A reference to our background animation
            mouseAnim: null,
            

            postCreate: function(){
            
			    // Get a DOM node reference for the root of our widget
			var domNode = this.domNode;
			 

			    
		   },
		   
		   startup: function() {
	
	
			parser.parse(); 
			
			console.log(this.tool.currentArea);

			layinfos = this.tool.displayLayers.layerInfos;
			
			dlp = q("#" + this.domNode.id + " .displayLayers");
			
 			vi = this.tool.displayLayers.visibleLayers;
			
			
			
			array.forEach(layinfos, lang.hitch(this,function(li,i) {
				
				newdd = domConstruct.create("span", { innerHTML: li.name + "<br>"});
				
				newchecknod = domConstruct.create("span");
				
				dom.byId(dlp[0]).appendChild(newdd);
				
				domConstruct.place(newchecknod, newdd, "before");
				
				if (array.indexOf(vi, i) > -1) {cv = true} else {cv = false};
				
				
				newcheckBox = new CheckBox({
						name: "dispalyLayers",
						value: "agreed",
						checked: cv
					}, newchecknod);
			
			
				newcheckBox.on("change", lang.hitch(this,function(e) {
					
					pvi = this.tool.displayLayers.visibleLayers;
					
					
					if (e == false) {
					  if (pvi.length == 1) { pvi = [] } else {
					  filteredArray = array.filter(pvi, function(it,j,ar) { if (j==i){ return false } else {return true}});
					  pvi = filteredArray;
					  }
					} else {
					  pvi.push(i)
					}
					
					//alert([0]);
					
					//this.tool.displayLayers.setVisibility(false)
					this.tool.displayLayers.setVisibleLayers(pvi);
					
								
					//alert(li.name)
					
					}))//function() {alert('');})
				
				//dom.byId(dlp[0]).appendChild(newcheckBox);
				
			})); 
			
			//this.tool.displayLayers.setVisibleLayers([0]);

			//loc = dom.byId(a[0]);
			
			//a = query(domNode)
			
			//thing = domConstruct.create("div", {class: 'row'}, a);
			
			
			//;
			
			cdata = new Array();
			rdata = new Array();
			
			
			this.mindepth = 9999999
			
			mdi = 0;
			
			
			array.forEach(this.tool.chartData.features, lang.hitch(this,function(entry,i) {
				
				//Was 4001
				if (i < 201) {
					cdata.push(entry.attributes.depth);	
				}
				
				if (entry.attributes.depth < this.mindepth) {this.mindepth = entry.attributes.depth; mdi = i };
				
			}));
			
			this.cleanChartData = cdata;
			
			if (mdi < 201) {
			
				this.cleanChartData = cdata.slice(0,mdi);
			
			}
			
			
				
			landPoint = this.tool.cdGraphicsLayer.graphics[0];
			this.tool.cdGraphicsLayer.remove(landPoint);

			rple = (this.tool.chartData.features[this.cleanChartData.length - 1].attributes.pointloc.replace("POINT(", "").replace(")","").split(" "))
						
			rpls = (this.tool.chartData.features[0].attributes.pointloc.replace("POINT(", "").replace(")","").split(" "))
							
			polylineJson = {
				"paths":[[[rpls[0], rpls[1]], [rple[0], rple[1]]]],
				"spatialReference":{"wkid":3857}
			  };
			  
			
			transect = new Polyline(polylineJson);
			lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([240,240,0]), 2)
			this.tool.cdGraphicsLayer.add(new Graphic(transect, lineSymbol));
	
			this.tool.cdGraphicsLayer.add(landPoint)
			this.tool.cdGraphicsLayer.remove(this.tool._reefpoint)
			this.tool.cdGraphicsLayer.add(this.tool._reefpoint);
			
			
			this.cleanChartData = this.cleanChartData.reverse();
			//alert(transect);
			
			labeldatadata = new Array();
			
			array.forEach(this.cleanChartData, lang.hitch(this,function(entry,i) {

				if (i == (this.cleanChartData.length - 100)) {
					rdata.push(0)
				} else {
					rdata.push(this.mindepth)	
				}
				
			
				labeldatadata.push({value:i, text: (this.cleanChartData.length - i)})
				
				//console.log(this.cleanChartData.length - i - 1);
				
			}));
			
			b = q("#" + this.domNode.id + " .cdslider")
			
			
			this.slider = new HorizontalSlider({
				name: "slider",
				value: this.cleanChartData.length - this.reefdistance,
				minimum: 0,
				maximum: this.cleanChartData.length,
				intermediateChanges: false,
				style: "margin-left:45px;width:435px;",
				onChange: lang.hitch(this,this.changeslider)
			}, b[0]);
			
			a = q("#" + this.domNode.id + " .cdlinechart");
			
			console.log(rdata.length)
			//console.log(((parseInt(this.cleanChartData.length/100) * 100)))
			
			rdatal = Math.floor(rdata.length / 10) * 10
			
			rdata = rdata.slice(0,rdatal)
			
			console.log(rdata.length)
			
			
			
			this.labeldatadata = new Array();
			this.labeldatadatafeet = new Array();
			this.ylabeldatadata = new Array();
			this.ylabeldatadatafeet = new Array();
				
				for (var i=500; i>-500; i--) {
				
					corval = (parseFloat(i) / parseFloat(10)) * -1
					this.ylabeldatadatafeet.push({value:corval, text: (corval * 3.28).toFixed(2)})
					this.ylabeldatadata.push({value:corval, text: corval})
				
				}
				
				this.ylabeldatadata.push({value:0, text: "0"})
				this.ylabeldatadatafeet.push({value:0, text: "0"})
			
			
			array.forEach(rdata, lang.hitch(this,function(entry,i) {
	
				this.labeldatadata.push({value:i, text: (rdata.length- i)})
				this.labeldatadatafeet.push({value:i, text: parseInt((rdata.length- i) * 3.28)})
				
			}));	

				this.labeldatadata.push({value:rdata.length, text: "0"})
				this.labeldatadatafeet.push({value:rdata.length, text: "0"})
			
			
			this.chart = new Chart(a[0]);
			this.chart.addPlot("default", {type:Areas});
			this.chart.addAxis("x", {title: "Distance from Shore (meters)", titleOrientation: "away", fixed: true, majorTickStep: parseInt((parseInt(this.cleanChartData.length/100) * 100) / 10), labels: this.labeldatadata}); //labels: [{value: 1, text: "Jan"}, {value: 1000, text: "Feb"}, {value: 5000, text: "Dec"}]
			this.chart.addAxis("y", {vertical: true, title: "Depth (Meters from MSL)", labels: this.ylabeldatadata} );
			this.chart.addSeries("Reef Location", rdata, {stroke: {color: "#5577EE",width: 2},fill: "#5577EE" });
			this.chart.addSeries("Depth Profile", this.cleanChartData, {stroke: {color: "#FF9900",width: 2},fill: "#FFF0D9"});
	
	
			metersthing = q("#" + this.domNode.id + " .cdmeters");
			metersclick = metersthing[0]
			this.units = "meters"
			
			on(metersclick, "click", lang.hitch(this, function(){ 
								this.units = "meters"
								this.changeunits("meters");
								
							}))

			feetthing = q("#" + this.domNode.id + " .cdfeet");
			feetclick = feetthing[0]
			
			on(feetclick, "click", lang.hitch(this, function(){ 
								this.units = "feet"
								this.changeunits("feet");
							}))
			
			
	
			helps = q("#" + this.domNode.id + " .cdhelp");
			//console.log(helps);

			array.forEach(helps, lang.hitch(this,function(entry,i) {
			
				//on(entry, "mouseover", function(){ alert('')})
				helpers = this.tool.currentArea.help;
				array.forEach(helpers, lang.hitch(this,function(h,i) {
					if(domClass.contains(entry, h.class)){ 
						
						infoarea = q("#" + this.domNode.id + " .cdinfo");
						infoarea = infoarea[0];
						console.log(infoarea);
						on(entry, "mouseover", function(){ 
								domAttr.set(infoarea, "innerHTML", h.text);
							})
						on(entry, "mouseout", function(){ 
								array.forEach(helpers, lang.hitch(this,function(hh,i) {
								  if(hh.class == "default"){ 
									domAttr.set(infoarea, "innerHTML", hh.text);
									}
								}));
							})
					}
					
					if(h.class == "default"){ 
					   domAttr.set(infoarea, "innerHTML", h.text);
					}
					
				}));
			
			}));
			
			this.chart.render();
			
			c = q("#" + this.domNode.id + " .cdlegend");
			
			this.legend = new Legend({ chart: this.chart }, c[0]);
			
			
			rnewProfile = q("#" + this.domNode.id + " .newProfileButton");  
			rnewProfile.on("click", lang.hitch(this,this.newProfile));	
			rnewSite = q("#" + this.domNode.id + " .newSiteButton");  
			rnewSite.on("click", lang.hitch(this,this.newSite));
			
			rmodProfile = q("#" + this.domNode.id + " .modProfileButton"); 
			rmodProfile.on("click", lang.hitch(this,this.modProfile));			
			
			
			rButton = q("#" + this.domNode.id + " .runButton");  //runButton
			
			rButton.on("click", lang.hitch(this,function(e) {
				
				ptloc = this.tool.chartData.features[this.reefdistance].attributes.pointloc;
				pid = this.tool.chartData.features[this.reefdistance].attributes.profilenumber;
				
				
				dataSourcecls = new QueryDataSource();
				dataSourcecls.workspaceId = this.tool.currentArea.services.workspaceId;
				//THIS DOES NOT WORK RIGHT --->//dataSourcecls.query = "select " + this.tool.currentArea.services.profileLines.OIDField + " as objectid, " + this.tool.currentArea.services.profileLines.profileField + " as profileid, ST_Distance(ST_GeomFromText('" + ptloc + "', 3857), shape) as distance from " + this.tool.currentArea.services.profileLines.dataset + " order by distance limit 3";
				// THIS ONLY WORKS SLIGHTLY BETTER
				dataSourcecls.query = "select " + this.tool.currentArea.services.landPoints.OIDField + " as objectid, " + this.tool.currentArea.services.landPoints.profileField + " as profileid, ST_Distance((select shape from " + this.tool.currentArea.services.landPoints.dataset + " where " + this.tool.currentArea.services.landPoints.profileField + " = " + pid +"), shape) as distance from " + this.tool.currentArea.services.landPoints.dataset + " order by distance limit 3";
				// THIS ONLY WORKS SLIGHTLY BETTER
				
				
				
				console.log(dataSourcecls.query);
				
				dataSourcecls.geometryType = "line";
				
				dataSourcecls.oidFields = ["objectid"] 
				
				layerSource2 = new LayerDataSource();
				layerSource2.dataSource = dataSourcecls;

				console.log(layerSource2)
				queryTask = new QueryTask(this.tool.currentArea.services.url + "/dynamicLayer", { source: layerSource2 });

				inquery = new esriQuery();
				inquery.returnGeometry = false;
				//query.outFields = allFields;
				inquery.outFields =["profileid","distance"]
				inquery.where = "objectid" + " > -1"; 
							
				queryTask.execute(inquery, lang.hitch(this,this.submitSenario));
				
				//
				
				
				
			}));	
			

			},
			
			changeunits: function(units) {
			
					if (units == "feet") {
					
					this.units = "feet";
					
					this.chart.addAxis("x", {title: "Distance from Shore (feet)", titleOrientation: "away", fixed: true, majorTickStep: parseInt(10*3.28) - 1, labels: this.labeldatadatafeet});
					
					this.chart.addAxis("y", {vertical: true, title: "Depth (Feet from MSL)", labels: this.ylabeldatadatafeet} );
					
					this.chart.render();
					
					
					} else { 
					
					this.units = "meters";

					this.chart.addAxis("x", {title: "Distance from Shore (meters)", titleOrientation: "away", fixed: true, majorTickStep: parseInt(10*3.28) - 1, labels: this.labeldatadata});
					
					this.chart.addAxis("y", {vertical: true, title: "Depth (Meters from MSL)", labels: this.ylabeldatadata} );
					
					this.chart.render();
					
					}
					
			},
			
		   submitSenario: function(results) {

			console.log(results);
		   
			inputsdiv = q("#" + this.domNode.id + " .cdInputs");
			domStyle.set(inputsdiv[0],"display","none")

			loadingdiv = q("#" + this.domNode.id + " .cdLoading");
			domStyle.set(loadingdiv[0],"display","")
			
			windsel = q("#" + this.domNode.id + " .inputWindType");
			wavesel = q("#" + this.domNode.id + " .inputWaveDef");
			watersel = q("#" + this.domNode.id + " .inputWaterLevel");
			reeftypesel = q("#" + this.domNode.id + " .inputReefType");
			
			reefhsel = q("#" + this.domNode.id + " .inputReefHeight");
			reefhselv = (dom.byId(reefhsel[0].id));
			reefhw = registry.byNode(reefhselv);

			reefbwsel = q("#" + this.domNode.id + " .inputReefBaseWidth");
			reefbwselv = (dom.byId(reefbwsel[0].id));
			reefbww = registry.byNode(reefbwselv);

			reefcwsel = q("#" + this.domNode.id + " .inputReefCrestWidth");
			reefcwselv = (dom.byId(reefcwsel[0].id));
			reefcww = registry.byNode(reefcwselv);				
		
			//alert(windsel[0].value + " " + wavesel[0].value + " " + watersel[0].value + " " + reeftypesel[0].value + " " + reefhw.get("value") + " " + reefbww.get("value") + " " + reefcww.get("value"));
		   
			if (this.units == "meters") {cf = 1} else {cf = 0.3048} 
			
			inputLatLon = this.tool.geopointtext;
		    inputProfiles = (results.features[1].attributes.profileid + "," + results.features[0].attributes.profileid + "," + results.features[2].attributes.profileid);
			inputWaterLevel = watersel[0].value;
			inputWindType = windsel[0].value;
			inputWaveDef = wavesel[0].value;
			inputReefType = reeftypesel[0].value;
			inputReefDistance = this.reefdistance;
			inputReefHeight = reefhw.get("value") * cf;
			inputReefBaseWidth = reefbww.get("value") * cf;
			inputReefCrestWidth = reefcww.get("value") * cf;
		   
			this.gp = new Geoprocessor(this.tool.currentArea.services.gpServer);
            this.gp.setOutputSpatialReference({
              wkid: 3857
            });
			
			
			params = {
              "inputLatLon": "26.7758,-82.1419",
              "inputProfiles": "13,14,17",
			  "inputWaterLevel": "MHHW",
			  "inputWindType": "Storm",
			  "inputWaveDef": "WindWave",
			  "inputReefType": "Trapz",
			  "inputReefDistance": 50,
			  "inputReefHeight": 1,
			  "inputReefBaseWidth": 12,
			  "inputReefCrestWidth": 8
            };
			
			params2 = {
              "inputLatLon": inputLatLon, //"26.7758,-82.1419",
              "inputProfiles": inputProfiles, //"13,14,17",
			  "inputWaterLevel": inputWaterLevel,
			  "inputWindType": inputWindType,
			  "inputWaveDef": inputWaveDef,
			  "inputReefType": inputReefType,
			  "inputReefDistance": inputReefDistance,
			  "inputReefHeight": inputReefHeight,
			  "inputReefBaseWidth": inputReefBaseWidth,
			  "inputReefCrestWidth": inputReefCrestWidth,
			  "inputSite": this.tool.currentArea.name
            };
			
            this.gp.submitJob(params2, lang.hitch(this,this.runcompleted));
		   
		   },
		   
		   runcompleted: function(jobInfo) {
		   
				inputsdiv = q("#" + this.domNode.id + " .cdLoading");
				domStyle.set(inputsdiv[0],"display","none")
				
						   
				console.log(jobInfo);
				
				//this.results = jobInfo.results;
				
				//array.forEach(this.results, lang.hitch(this,function(result,i) {
				
				//}
				
				this.outResults = {} //new Array();
				this.outResults["count"] = 0;
				this.gp.getResultData(jobInfo.jobId,"aHeight",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"aPower",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"hReef",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"hNoReef",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"outMessages",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"outputLocation",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"xAtn",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"xHeight",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"Xreef",lang.hitch(this, this.registerResult));
				this.gp.getResultData(jobInfo.jobId,"Yreef",lang.hitch(this, this.registerResult));		
		   
		   },
		   
		   registerResult: function(resultvalue) {
		   
				this.outResults[resultvalue.paramName] = resultvalue
				
				this.outResults["count"] = this.outResults["count"] + 1
				
				console.log(resultvalue);
				//this.outResults.push(resultvalue);
				
				if (this.outResults["count"] == 10) {
					console.log("Results Returned:")
					console.log(this.outResults);
					//execute results here!!!
					
				resultsdiv = q("#" + this.domNode.id + " .cdResults");
				domStyle.set(resultsdiv[0],"display","")
			
				tabsr = q("#" + this.domNode.id + " .cdchartTabs");
	
				tabs = new TabContainer({
					style: "height: 100%; width: 100%;"
				}, tabsr[0]);

				cp1 = new ContentPane({
					title: "Wave Height",
					content: "<div class='cdheightchart'> </div><div class ='cdwlegend' style='width: 500px'> </div>"
					});
				tabs.addChild(cp1);
	
				cp2 = new ContentPane({
					title: "Wave Reduction",
					content: "<div class='cdatnchart'> </div><div class ='cdwlegend2' style='width: 500px'> </div>"
				});
				tabs.addChild(cp2);
	
				//on(cp1, "focus", function() {alert('')});
	
				tabs.startup();
			
				tabs.selectChild(cp1);
				
				
				distancetoClip = this.outResults["hReef"].value.length - this.reefdistance - 20
				end = this.outResults["hReef"].value.length 
				
				rheightfixed = this.outResults["hReef"].value.slice(distancetoClip,end)  
				
				nrheightfixed = this.outResults["hNoReef"].value.slice(distancetoClip,end) 
				
				stheme = new SimpleTheme({
					colors: [
						"#A4CE67",
						"#739363",
						"#6B824A",
						"#343434",
						"#636563"
						]
					});
					
				stheme.plotarea = { fill: "#DDD" }; 
				
				a = q("#" + this.domNode.id + " .cdheightchart");
			
				domConstruct.empty(a[0]);
			
				this.hchart = new Chart(a[0], {fill:   "#FFF" });
				
				this.hchart.setTheme(stheme);

				mm = minMax(this.outResults["hReef"].value, array)			
				rdata = fillArray(mm[0], this.outResults["hReef"].value.length);
				rdata[this.outResults["hReef"].value.length - this.reefdistance - 5] = mm[1];
				
				rout = rdata.slice(distancetoClip,end) 
				
				if (this.units == "meters") {cf = 1} else {cf = 3.28} 
				
				labeldatadata = new Array();
				
				xax = this.outResults["xHeight"].value
				
				reefdata = []
				
				xreefv = this.outResults["Xreef"].value;
				yreefv = this.outResults["Yreef"].value;
				
				console.log(xreefv);
				console.log(yreefv);
				
				array.forEach(xax, lang.hitch(this,function(entry,i) {
	
					//if (((xax.length - i) % 10) == 0) {
						labeldatadata.push({value:i-1, text: parseInt(entry * cf)})
						//reefdata.push(0)
						
						cv = entry;//parseInt(entry)
						
						if (cv > xreefv[0]) {
							reefdata.push(yreefv[0])
						} else if (cv < xreefv[3]) {
							reefdata.push(yreefv[0])
						} else {
						
							if (cv > xreefv[1]) {
							
								valout = parseFloat(( xreefv[1] - cv )) / parseFloat(( xreefv[1] - xreefv[0] )) 
								
								valin = 1-valout
						
								valout = ((yreefv[1] - yreefv[0]) * valin) + yreefv[0]
								
								
								reefdata.push(valout)

								
							} else if (cv < xreefv[2]) {

								valout = parseFloat(( cv - xreefv[2] )) / parseFloat(( xreefv[3] - xreefv[2] )) 
								
								
								valin = 1- valout
								console.log(valin)
								
								valout = ((yreefv[2] - yreefv[3]) * valin) + yreefv[3]
								
								console.log(valout)
								
								reefdata.push(valout)
					
							} else {
						
								reefdata.push(yreefv[1])
						
							}
						
						
						
						}
				
						//array.forEach(xreefv, lang.hitch(this,function(xr,xri) {
								//console.log(xri)
								//console.log("tttttttttttttt");
						//		if (i-1 == xr) {
						//			reefdata.push(yreefv[xri])
						//		} //else {
								//	reefdata.push(0)
								//}
						//}));							
					//}
				}));
				
				if (yreefv[1] < 0) {
				
					minchart = yreefv[1] - 0.1
				
				} else {
				
					minchart = 0;
				
				}
			
				ylabs = []
			
				//ylabs.push({value:-0.2, text: " "})
				//ylabs.push({value:-0.1, text: " "})
				//ylabs.push({value:-0.0, text: "0"})
				
				
				
				for (var i=500; i>0; i--) {
				
					corval = (parseFloat(i) / parseFloat(10)) * -1
					ylabs.push({value:corval, text: " "})
						
				}
				
				ylabs.push({value:0, text: "0"})
				
				
				for (var i=1; i<500; i++) {
				
					corval = (parseFloat(i) / parseFloat(10))
					ylabs.push({value:corval, text: (corval * cf).toFixed(2)})
						
				}
				
				
				//ylabs.push({value:0.1, text: "0.1"})
				
				console.log(ylabs);
				
				
				console.log("***************************************************");
				console.log(reefdata);	
				console.log("***************************************************");				
				
				labeldatadata.push({value:xax.length, text: "0"})
				
				this.hchart.addPlot("default", {type: Lines});
				this.hchart.addPlot("reefarea", {type:Areas});
				
				this.hchart.addAxis("x", {title: "Distance from Shore (" + this.units + ")", titleOrientation: "away", labels: labeldatadata}) //, majorTickStep: 10, fixUpper: "major"}); 
				this.hchart.addAxis("y", {vertical: true, title: "Height (" + this.units + ")", min: minchart, labels: ylabs});

				
				this.hchart.addSeries("Restoration Scenario", this.outResults["hReef"].value, {stroke: {color: "#2EB82E",width: 2},fill: "#2EB82E" });
				this.hchart.addSeries("Current Scenario", this.outResults["hNoReef"].value, {stroke: {color: "#5577EE",width: 2},fill: "#5577EE" });
				
				this.hchart.addSeries("Reef Position", reefdata, {plot: "reefarea", stroke: {color: "#006600",width: 0},fill: "#006600" });
				
				//this.hchart.addSeries("Reef Position", rout, {stroke: {color: "#005200",width: 2},fill: "#005200" });
				

				this.hchart.render();

				c = q("#" + this.domNode.id + " .cdwlegend");
			
				this.wlegend = new Legend({ chart: this.hchart }, c[0]);
				
				tabs.selectChild(cp2);
				
				
				a = q("#" + this.domNode.id + " .cdatnchart");
				
				domConstruct.empty(a[0]);
			
				this.achart = new Chart(a[0]);
	
				this.achart.setTheme(stheme);
				
				labeldatadata2 = new Array();
				
				minval = 100
				
				leftover = (this.outResults["aPower"].value.length % 10)
				
				//alert(leftover);
				
				//for (var i=0; i<(10-leftover); i++)
				//	{
				//		this.outResults["aPower"].value.unshift(100);
				//		this.outResults["aHeight"].value.unshift(100);
				//	}	
				
				reefmin = yreefv[0]
				reefmax = yreefv[1]
				
				reefdata2 = []
				
				array.forEach(this.outResults["aPower"].value, lang.hitch(this,function(entry,i) {
	
				
					labeldatadata2.push({value:i, text: (this.outResults["aPower"].value.length - i)})
					if (entry < minval) {
						minval = entry
						}
				}));
				
				labeldatadata2.push({value:this.outResults["aPower"].value.length, text: "0"})
				
				minval = parseInt(minval * 0.75)
				
				array.forEach(reefdata, lang.hitch(this,function(entry,i) {
	
					ov = ((parseFloat(entry - reefmin) / parseFloat(reefmax - reefmin)) * (100 - minval)) + minval
					//console.log(ov)
					reefdata2.push(ov)
	
				}));				
				
				
				this.achart.addPlot("default", {type: Lines});
				this.achart.addPlot("reefarea", {type:Areas});
				
				this.achart.addAxis("x", {title: "Distance from Shore (" + this.units + ")", titleOrientation: "away", labels: labeldatadata , majorTickStep: 10}); 
				this.achart.addAxis("y", {vertical: true, title: "Percent of Original (100 - 0)", min: minval});
				this.achart.addSeries("Wave Power", this.outResults["aPower"].value, {stroke: {color: "#FF0000",width: 2},fill: "#FF0000" });
				this.achart.addSeries("Wave Height", this.outResults["aHeight"].value, {stroke: {color: "#5577EE",width: 2},fill: "#5577EE" });
				
				this.achart.addSeries("Reef Position", reefdata2, {plot: "reefarea", stroke: {color: "#006600",width: 0},fill: "#006600" });
							

				this.achart.render();

				c = q("#" + this.domNode.id + " .cdwlegend2");
			
				this.wlegend2 = new Legend({ chart: this.achart }, c[0]);				
				
				//domStyle.set(this.wlegend2.domNode, "display", "none");
				
				tabs.selectChild(cp1);				
				
				a = q("#" + this.domNode.id + " .cdoutmess");
				a[0].innerHTML = this.outResults["outMessages"].value 
				//+ "For a more detailed report click <a href='http://dev.services2.coastalresilience.org/outputs/" + this.outResults["outputLocation"].value + "' target='_blank'>here</a>"
				
				unis = q("#" + a[0].id + ".cddispalyunits");
				
				if (this.units == "feet") {
					unum = unis[0].innerHTML.split(" ")[0];
					unum = (unum * 3.28).toFixed(2) + " feet"
					unis[0].innerHTML = unum
					}
				

				vdButton = q("#" + this.domNode.id + " .viewdetail");  //runButton
			
				vdButton.on("click", lang.hitch(this,function(e) {		

						window.open('http://dev.services2.coastalresilience.org/outputs/' + this.outResults["outputLocation"].value);
				
				}));
				

				
				}
		   },
		   
		   
		   changeslider: function(e) {
				   
				newdistance = this.cleanChartData.length - parseInt(e);
				
				this.reefdistance = newdistance;
				 
				rdata = fillArray(this.mindepth, this.cleanChartData.length)
			
				rdata[parseInt(e)] = 0;
			
			//array.forEach(this.tool.chartData.features, lang.hitch(this,function(entry,i) {
			//	
			//	if (i == newdistance) {
			//		rdata.push(0)
			//	} else {
			//		rdata.push(this.mindepth)	
			//	}
			//	
			//}));
			
				rpl = (this.tool.chartData.features[newdistance].attributes.pointloc.replace("POINT(", "").replace(")","").split(" "))
				
				reefpoint = new Point(rpl[0], rpl[1], new SpatialReference({ wkid: 3857}));
				
				pointSymbol = new PictureMarkerSymbol('plugins/coastal_defense/images/reef.png', 40, 40);
														
				//newreefgraphic = new Graphic(reefpoint, pointSymbol)
	
				//reefloc = this.tool.cdGraphicsLayer.graphics[1];
				
				//reefloc.setGeometry(newreefgraphic);
				
				this.tool.cdGraphicsLayer.remove(this.tool._reefpoint)
				
				this.tool._reefpoint = new Graphic(reefpoint, pointSymbol)
				
				this.tool.cdGraphicsLayer.add(this.tool._reefpoint);
				
				curx = this.map.extent;
				
				curglx = graphicsUtils.graphicsExtent([this.tool.cdGraphicsLayer.graphics[2],this.tool.cdGraphicsLayer.graphics[1]]);
				
				//uex = curx.union(curglx);
				
				//console.log(curx)
				//console.log(curglx)
				
				
				if ((curx.xmin < curglx.xmin) && (curx.xmax > curglx.xmax) && (curx.ymin < curglx.ymin) && (curx.ymax > curglx.ymax)) {
					//alert("in")
				} else {
					this.map.setExtent((graphicsUtils.graphicsExtent([this.tool.cdGraphicsLayer.graphics[2],this.tool.cdGraphicsLayer.graphics[1]])).expand(25));
				}
				
				//this.map.setExtent((graphicsUtils.graphicsExtent(this.tool.cdGraphicsLayer.graphics)).expand(5));
				   
				this.chart.addSeries("Reef Location", rdata, {stroke: {color: "#5577EE",width: 2},fill: "#5577EE" });
				this.chart.render();
				  
	 		},
			
			newSite: function(e) {
			

				
				//resetf = lang.hitch(this.tool,this.tool.showStartWindow)
				//resetf(this.tool.clabel, this.tool.ckey);
				
				resetf = lang.hitch(this.tool,this.tool.geoSelect)
				resetf();
				
				//domStyle.set(this.tool.geoSelectDiv, "display", "");
				//domStyle.set(this.tool.button.domNode, "display", "");
				
				domConstruct.destroy(this.domNode);
				
	
			
			},
			
			modProfile: function(e) {
			
				resultsdiv = q("#" + this.domNode.id + " .cdResults");
				domStyle.set(resultsdiv[0],"display","none")
			
				inputsdiv = q("#" + this.domNode.id + " .cdInputs");
				domStyle.set(inputsdiv[0],"display","")
			
			},
			
			newProfile: function(e) {


				resetf = lang.hitch(this.tool,this.tool.geoSelect)
				resetf();
			
				resetf = lang.hitch(this.tool,this.tool.showStartWindow)
				resetf(this.tool.clabel, this.tool.ckey);
				
				//domStyle.set(this.tool.geoSelectDiv, "display", "");
				//domStyle.set(this.tool.button.domNode, "display", "");
				
				domConstruct.destroy(this.domNode);
				
		
			}
			


        });
});


function fillArray(value, len) {
	var arr = [];
	for (var i = 0; i < len; i++) {
		arr.push(value);
	};
	return arr;
}

function minMax(inar, ar) {

console.log(inar);
 min = 99999999999999999999;
 max = -99999999999999999999;

	ar.forEach(inar, function (entry,g) {

		if (entry < min) {min = entry};
		if (entry > max) {max = entry};
	}
	)
	
	
	return [min,max]
}


