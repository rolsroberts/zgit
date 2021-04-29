sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "GroupageNamespace/GroupageModule/controller/BaseController",
    "../model/formatter"
],

    function (Controller, MessageToast, Fragment, BaseController, formatter) {
        "use strict";
        

        return BaseController.extend("GroupageNamespace.GroupageModule.controller.Home", {
            formatter: formatter,
            
            mloopTime: "3000",

            onInit: function () {
                this.CarousselPageChanged();
            },
            onNewOrder: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteNewOrder");
                MessageToast.show("gdfgfdgfd");
            },
            onExistingOrder: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteExistingOrder");
            },

            onFaq: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteFaq");
            },

            CarousselPageChanged: function () {
                // select random carousel page at start
                var oWelcomeCarousel = this.byId("welcomeCarousel");
                var iRandomIndex = Math.floor(Math.random() * oWelcomeCarousel.getPages().length);
                oWelcomeCarousel.setActivePage(oWelcomeCarousel.getPages()[iRandomIndex]);
            },
            onCarouselPageChanged: function () {
                this._iCarouselTimeout = setTimeout(function () {
                    var oWelcomeCarousel = this.byId("welcomeCarousel");
                    if (oWelcomeCarousel) {
                        oWelcomeCarousel.next();
                        this.onCarouselPageChanged();
                    }
                }.bind(this), this.mloopTime);
            },            

            onSeeOurContact: function (oEvent) {
                this.openContactUsFragment(oEvent)
            }
        });


    });
