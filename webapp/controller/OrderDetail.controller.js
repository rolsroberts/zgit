sap.ui.define([
    "GroupageNamespace/GroupageModule/controller/BaseController",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat"
], function (BaseController,formatter,oHistory,DateFormat) {
    "use strict";
    
	return BaseController.extend("GroupageNamespace.GroupageModule.controller.OrderDetail", {
        formatter:formatter,
        onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("RouteOrderDetail").attachMatched(this._onRouteMatched, this);
			// Hint: we don't want to do it this way
			/*
			oRouter.attachRouteMatched(function (oEvent){
				var sRouteName, oArgs, oView;
				sRouteName = oEvent.getParameter("name");
				if (sRouteName === "employee"){
					this._onRouteMatched(oEvent);
				}
			}, this);
			*/
		},
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
            oView = this.getView();
            
            

			oView.bindElement({
                //path : "/Orders(" + oArgs.OrderNr + ")",
                path : "/Orders/2",
                events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
                    },
                    
                }
                ,model: "OrderData"
			});
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
        },
        
        onPost: function (oEvent) {
			var sDate = "25.03.90";
			var oObject = this.getView().getBindingContext().getObject();
			var sValue = oEvent.getParameter("value");
			var oEntry = {
				productID: oObject.ProductID,
				type: "Comment",
				date: sDate,
				comment: sValue
			};
			// update model
			var oFeedbackModel = this.getModel("OrderData");
			var aEntries = oFeedbackModel.getData().Notifications;
			aEntries.push(oEntry);
			oFeedbackModel.setData({
				productComments : aEntries
            });
            
            
        },
        
        onBackButtonPress: function(oEvent){
            var oHistoryHash = oHistory.getInstance().getPreviousHash();
            //when the previous Hash is undefined through for ex.google navigation
                if (oHistoryHash !== undefined ){
                    window.history.go(-1)
                } else {
                    sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteExistingOrder") 
                }
        },
        
    

      onPost: function (oEvent) {
        // Updates the model with the user comments on Products.
         var oFormat = DateFormat.getDateTimeInstance({style: "medium"});
         var sDate = oFormat.format(new Date());
         var oObject = "vfdsgfdgf";
         var sValue = oEvent.getParameter("value");
         var oEntry = {
             Autor: "me",
             Datum: oObject,
             text: sValue,
             status: "closed"
         };        
         // update model
         var oFeedbackModel = this.getModel("OrderData>Notifications");
         var aEntries = oFeedbackModel.getData().Notifications;
         aEntries.push(oEntry);
         oFeedbackModel.setData({
            Notifications : aEntries
         });
      }
	});
});