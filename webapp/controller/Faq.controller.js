sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "GroupageNamespace/GroupageModule/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (Controller,oHistory,BaseController,JSONModel) {
	"use strict";

	return BaseController.extend("GroupageNamespace.Groupageproject.controller.Faq", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf GroupageNamespace.Groupageproject.view.profile
		 */
		onInit: function () {
            this.getView().setModel(new JSONModel({
					features: [
						"Enterprise-Ready Web Toolkit",
						"Powerful Development Concepts",
						"Feature-Rich UI Controls",
						"Consistent User Experience",
						"Free and Open Source",
						"Responsive Across Browsers and Devices"
					]
				})
          )
        },
        
        onBackButtonPress: function(oEvent){
            var oHistoryHash = oHistory.getInstance().getPreviousHash();
            //when the previous Hash is undefined through for ex.google navigation
            if (oHistoryHash !== undefined ){
                window.history.go(-1)
            } else {
                sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteHome") 
            }
        },
        onSeeOurContact: function (oEvent) {
            this.openContactUsFragment(oEvent)
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf GroupageNamespace.Groupageproject.view.profile
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf GroupageNamespace.Groupageproject.view.profile
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf GroupageNamespace.Groupageproject.view.profile
		 */
		//	onExit: function() {
		//
		//	}

	});

});