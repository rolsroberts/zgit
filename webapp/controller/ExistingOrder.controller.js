sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter" ,
    "GroupageNamespace/GroupageModule/controller/BaseController",
    "sap/ui/core/routing/History"
], function (Controller,formatter,BaseController,oHistory) {
	"use strict";

	return BaseController.extend("GroupageNamespace.GroupageModule.controller.ExistingOrder", {
        formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf GroupageNamespace.Groupageproject.view.existingOrder
		 */
		onInit: function () {
			var dataModel = this.getOwnerComponent().getModel("OrderData");
			this.getView().setModel(dataModel, "OrderModel");
		},
		onTableSettings: function (oEvent) {
			// Open the Table Setting dialog 
			this._oDialog = sap.ui.xmlfragment("GroupageNamespace.GroupageModule.view.SettingsDialog", this);
			this._oDialog.open();
		},
		onConfirm: function (oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("AllOrdersTab");
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			// apply grouping 
			var aSorters = [];
			if (mParams.groupItem) {
				var sPath = mParams.groupItem.getKey();
				var bDescending = mParams.groupDescending;
				var vGroup = function (oContext) {
					var name = oContext.getProperty("StatusPending");
					return {
						key: name,
						text: name
					};
				};
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
			}
			// apply sorter 
			var sPath = mParams.sortItem.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
			// apply filters 
			var aFilters = [];
			for (var i = 0, l = mParams.filterItems.length; i < l; i++) {
				var oItem = mParams.filterItems[i];
				var aSplit = oItem.getKey().split("___");
				var sPath = aSplit[0];
				var vOperator = aSplit[1];
				var vValue1 = aSplit[2];
				var vValue2 = aSplit[3];
				var oFilter = new sap.ui.model.Filter(sPath, vOperator, vValue1, vValue2);
				aFilters.push(oFilter);
			}
			oBinding.filter(aFilters);
        },
        
        onExistingOrderDetail : function(oEvent){
			var oItem, oCtx;
			oItem = oEvent.getParameter("listItem") ;// oEvent.getSource();
			oCtx = oItem.getBindingContext("OrderModel");
			this.getRouter().navTo("RouteOrderDetail",{
				OrderNr: oCtx.getProperty("OrderNr")
			});
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
		 * @memberOf GroupageNamespace.Groupageproject.view.existingOrder
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf GroupageNamespace.Groupageproject.view.existingOrder
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf GroupageNamespace.Groupageproject.view.existingOrder
		 */
		//	onExit: function() {
		//
		//	}

	});

});