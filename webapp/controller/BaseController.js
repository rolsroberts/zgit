sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment"
], function (Controller, History, Fragment) {
	"use strict";
 
	return Controller.extend("GroupageNamespace.GroupageModule.controller.BaseController", {
        //https://inui.io/sap-ui5-base-controller/
        //https://sapui5.hana.ondemand.com/1.36.6/explored.html#/sample/sap.ui.core.tutorial.navigation.07/preview
        //https://openui5.hana.ondemand.com/entity/sap.m.tutorial.worklist
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
 
		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
 
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
 
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("RouteHome", {}, true /*no history*/);
			}
        },
        
        openContactUsFragment: function(oEvent) {
             var oModelCompany=this.getView().getModel("CompanyContactDetailData");
            var oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pQuickView) {
				this._pQuickView = Fragment.load({
					id: oView.getId(),
					name: "GroupageNamespace.GroupageModule.view.ContactCard",
					controller: this
				}).then(function (oQuickView) {
					oQuickView.setModel(oModelCompany);
                    oView.addDependent(oQuickView);
                    return oQuickView;
                    //var fragement = sap.ui.xmlfragment("GroupageNamespace.GroupageModule.view.ContactCard", this);
                    //oQuickView.setPlacement(sap.m.PlacementType.Left);
                }.bind(this));
			}
			this._pQuickView.then(function(oQuickView) {
                oQuickView.openBy(oButton);
			});

        }
 
	});
 
});