sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/Element",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/library",
    "GroupageNamespace/GroupageModule/controller/BaseController"
], function (Controller, JSONModel, Fragment, Element, MessageToast, MessageBox, mobileLibrary, BaseController) {
    "use strict";

    return BaseController.extend("GroupageNamespace.GroupageModule.controller.NewOrder", {
//https://www.youtube.com/watch?v=R3h4cUuWzm8
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf GroupageNamespace.Groupageproject.view.newOrder
		 */
        onInit: function () {
            //anytime, when the View gets called i have to initialize my Viwe
            this.getOwnerComponent().getRouter().getRoute("RouteNewOrder").attachPatternMatched(this._initialize, this);
            //anytime,we initialise a empty model
            var newOrderData = {
                "OrderNr": "",
                "firstName": "Robert",
                "secondName": "Ngotom Essote",
                "birthdate": "25",
                "email": "",
                "mobilePhone": "",
                "residenceStreet": "",
                "residenceStreetNr": "",
                "residencePostCode": "",
                "residencePostCity": "",
                "residenceLand": "Germany",

                "destinationPort": "",
                "deliveryOption": "",
                "altCity": "",
                "nextShippingDate": "",
                "storageDays": 0,
                "ReceiverFirstName": "",
                "ReceiverSecondName": "",
                "ReceiverPhone": "0176256652",

                "acceptTermsCond": "",
                "streetConsignment": "",
                "streetNrConsignment": "",
                "cityConsignment": "",
                "postCodeConsignmemt": "",

                "pickUpOption": "",
                "fromAdress": "",
                "toAdress": "",
                "datePickUp": "",
                "PickUpTrackingInfo": "",
                "ConsignmentInfo": [
                    {
                        "consignmentNr": "",
                        "consignmentType": "",
                        "consignmentSize": "",
                        "consignmentContent": [{
                            "Key": "",
                            "Description": ""
                        }]
                    }],
            };


            this.model = new sap.ui.model.json.JSONModel();
            this.model.setData(newOrderData);

           // this.model.setData({
           //     mobilePhoneState: "Error",
           //     emailState: "Error"
           // });
           
           // this.getView().setModel(this.model, "ModelNewOrder");


            // we add some other properties with standard values to our Model 
            this.model.setProperty("/residenceLand", "Germany");
            this.model.setProperty("/sexeMale", true);
            this.model.setProperty("/sexeFemale", false);
            this.model.setProperty("/secondName", "Essote");
            this.model.setProperty("/firstName", "Robert");
            this.model.setProperty("/birthdate", "2020-03-25");
            this.model.setProperty("/mobilePhone", "015211976477");
            this.model.setProperty("/eMail", "essote@gmx.de");
            this.model.setProperty("/residenceStreet", "Madamen weg");
            this.model.setProperty("/residenceStreetNr", "125");
            this.model.setProperty("/adress_co", "");
            this.model.setProperty("/residencePostCode", "");
            this.model.setProperty("/residenceCity", "");

            this.model.setProperty("/destinationPort", "");
            this.model.setProperty("/deliveryOption", "");
            this.model.setProperty("/altCity", "");
            this.model.setProperty("/nextShippingDate", "");
            this.model.setProperty("/storageDays", "");
            this.model.setProperty("/receiverFirstName", "");
            this.model.setProperty("/receiverSecondName", "");
            this.model.setProperty("/receiverPhone", "");


            this.model.setProperty("/consignmentType", "");

            this.model.setProperty("/acceptTermsCond", false);
            this.model.setProperty("/streetConsignment", "");
            this.model.setProperty("/streetNrConsignment", "");
            this.model.setProperty("/cityConsignment", "");
            this.model.setProperty("/postCodeConsignmemt", "");

            this.model.setProperty("/pickUpOption", "");
            this.model.setProperty("/fromAdress", "");
            this.model.setProperty("/toAdress", "");
            this.model.setProperty("/datePickup", "");

            this.model.setProperty("/payOption", "");

            this.getView().setModel(this.model, "ModelNewOrder");
        },

        _initialize: function () {
            //init the reviewfragment
            this._oNavContainer = this.byId("wizardNavContainer");
            this._oWizardContentPage = this.byId("wizardContentPage");

            Fragment.load({
                name: "GroupageNamespace.GroupageModule.view.WizardReviewPage",
                controller: this
            }).then(function (oWizardReviewPage) {
                this._oWizardReviewPage = oWizardReviewPage;
                this._oNavContainer.addPage(this._oWizardReviewPage);
            }.bind(this));

            //bind the landmodel to the Control-Id
            //var landModel = this.getOwnerComponent().getModel("ReceiverLandData");
            //this.getView().byId("oSelectRcvLand").setModel(landModel);

            //define the PickUp Date 
            this.byId("PickUpDate").setMinDate(new Date(2020, 2, 1));
            this.byId("PickUpDate").setMaxDate(new Date(2020, 12, 31));
            this.byId("PickUpDate").setInitialFocusedDateValue(new Date(2020, 12, 10));

            //after initialization, i have to open a POp-UP
            this._OpenConsignorDialog();

        },
        onAfterRendering: function () {
            // Open the fragmentdialog 
            this._OpenConsignorDialog();
        },
        onConsignmentTypeChange: function (oEvent) {
            this.byId("PickUpOptionFlex").setEnabled(true);
            //initialize the third secftion and hide all the messages       
            this._initializeThirdSection();
            this._order_Packaging(false);
            // Read the selected Consignmentype
            var OconsignmentType = oEvent.getParameter("item").getText();
            if (OconsignmentType === "Vehicle") {
                this._ConsignmentType_vehicle()
            } else if (OconsignmentType === "Parcel") {
                this._ConsignmentType_Parcel();
            } else if (OconsignmentType === "Pallet") {
                this._ConsignmentType_Pallet();
            } else {
                this._order_Packaging(false)
                this._ConsignmentType_Fcl();
            }
        },


        onPickUpOptionChange: function (oEvent) {
            
            var sPickUpOption = oEvent.getParameter("item").getText();
            //let oSegmentedButton = this.byId("PickUpOption");
            //sPickUpOption = oSegmentedButton.getSelectedItem();
            this.model.setProperty("/pickUpOption", sPickUpOption);
            if (sPickUpOption === "Flexible Date") {
                this._pickUpFlex();
            } else {
                this._bringYourself();
                //var oFragment = sap.ui.xmlfragment("GroupageNamespace.GroupageModule.view.PostAdress", this);
                //this.getView().byId("page").addContent(oFragment);
            }
        },
        _bringYourself: function () {
            this.byId("SelectFlexDateWarning").setVisible(false);
            this.byId("PickUpDate").setEnabled(true);
            this.byId("FromCity").setEnabled(false);
            this.byId("PickUpDate").setEnabled(false);
            this.byId("PickUpBigConsignment").setVisible(false);
            this.byId("bringyourself").setVisible(true);
            this.byId("PickUpDate").setValue("");
            this.byId("FromCity").setValue("");
            this.byId("SelectBringYourself").setVisible(true);
            this.byId("LocationId").setVisible(true);
        },
        _pickUpFlex: function () {
            this.byId("SelectFlexDateWarning").setVisible(true);
            this.byId("FromCity").setEnabled(true);
            this.byId("PickUpDate").setEnabled(false);
            this.byId("PickUpDate").setValue("");
            this.byId("PickUpBigConsignment").setVisible(true);
            this.byId("bringyourself").setVisible(false);
            this.byId("SelectBringYourself").setVisible(false);
            this.byId("LocationId").setVisible(false);
        },
        onAddConsignment: function (oEvent) {
            
            var sConsignmentType = this.getView().byId("ConsignmentType").getValue();
            //depending on the Consignmentype, put the right Logo in the table
            if (sConsignmentType ==="Carton") {
                sConsignmentType = "sap-icon://database";
            } else if(sConsignmentType ==="Vehicle") {
                sConsignmentType = "sap-icon://shipping-status";
            } else if(sConsignmentType ==="Pallet") {
                sConsignmentType = "sap-icon://grid";
            } else if(sConsignmentType ==="FCL"){
               sConsignmentType ="" ;
            }

            var sConsignmentSize = this.getView().byId("ConsignmentSize").getValue();
           // var sConsignmentNr = sConsignmentNr + 1;this._ConsigmentModel.getData().consignmentDetail.length
           if  (this.byId("ConsignmentTable").getModel("ConsignmentModel") === undefined){
              var sConsignmentNr = 1;
           }else {
              var sConsignmentNr = this._ConsigmentModel.getData().consignmentDetail.length + 1;
           };
          
          var sConsignmentContentDescr = this.consignmentContent;
          var sBuyPackaging = this.getView().byId("BuyPackaging").getState();

            if (sConsignmentSize !== "" && sConsignmentType !== "") {

                // Push this entry into array and bind it to the table
                this._data = {
                    consignmentDetail: [{
                            "ConsignmentNr": sConsignmentNr,
                            "ConsignmentType": sConsignmentType,
                            "ConsignmentSize": sConsignmentSize,
                            "BuyPackaging": sBuyPackaging,
                            "ContentDescr": sConsignmentContentDescr,
                            // "ConsignmentPicture":sConsignmentPic
                        }]
                };
               
               
                
                if (this.byId("ConsignmentTable").getModel("ConsignmentModel") === undefined) {
                   //initialize the Model
                    this._ConsigmentModel = new sap.ui.model.json.JSONModel();
                   
                    this._ConsigmentModel.setData(this._data);
                    //modify the Model
                    this.model.setProperty("/consignmentDetail", this._ConsigmentModel.getData() )
                    this.byId("ConsignmentTable").setModel(this._ConsigmentModel,"ConsignmentModel");        
                } else {
                   var aTableData = this._data;
                   this._ConsigmentModel.getData().consignmentDetail.push(aTableData.consignmentDetail[0]);
                   this._ConsigmentModel.refresh();
                   //modify the Model
                     this.model.setProperty("/consignmentDetail", this._ConsigmentModel.getData() )
                    //add data from  Model to Table
                     this.byId("ConsignmentTable").setModel(this._ConsigmentModel, "ConsignmentModel");   
                }
                
            };
            //delete the content for the next Consignment
            delete this.consignmentContent;
            this.byId("ConsignmentContent").removeAllSelectedItems();
        },

        onSelectionFinishContent: function (oEvent) {

            var selectedItems = oEvent.mParameters.selectedItems;
            for (var i = 0; i < selectedItems.length; i++) {
                if  ( this.consignmentContent === undefined ) {
                //    this.consignmentContent =  selectedItems[i].getText();
                } else {
                //    this.consignmentContent =  this.consignmentContent + selectedItems[i].getText();
                };
                
                //this.model.getProperty("/ConsignmentInfo/ConsignmentContent/").push(selectedItems[i]);
            }
        },
        
        onHandleSelectionChange: function(oEvent) {
            //Each time, when we select or deselect something
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");

			var state = "Selected";
			if (!isSelected) {
                //if the User deselects, remove the selected Item from the String
                state = "Deselected";
                this.consignmentContent = this.consignmentContent.replace(changedItem.getText(), "");
                //delete the ',' in the string at the first pos or at the End
                if ( this.consignmentContent.substring(0,1)  === "," ) {
                    this.consignmentContent = this.consignmentContent.slice(1,this.consignmentContent.length);
                } ;
                if ( this.consignmentContent.substr(this.consignmentContent.length-1,1)  === ",") {
                    this.consignmentContent = this.consignmentContent.slice(0,this.consignmentContent.length-1);
                };
			} else {
                if  ( this.consignmentContent === undefined ) {
                    this.consignmentContent =  changedItem.getText() ;
                } else {
                    this.consignmentContent =  this.consignmentContent + "," + changedItem.getText();
                };
            };

            

			MessageToast.show("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
				width: "auto"
			});
		},


        onDeleteConsignment: function (oArg) {
            var deleteRecord = oArg.getSource().getBindingContext('ConsignmentModel').getObject();
            for (var i = 0; i < this._ConsigmentModel.getData().consignmentDetail.length; i++) {
                if (this._ConsigmentModel.getData().consignmentDetail[i] == deleteRecord) {
                    //pop this._data.Products[i] 
                    this._ConsigmentModel.getData().consignmentDetail.splice(i, 1); //removing 1 record from i th index.
                    this._ConsigmentModel.refresh();
                    //Akktualieseren des Modells (neworder)
                    this.model.setProperty("/consignmentDetail", this._ConsigmentModel.getData() )
                    //Aktualisieren der Table
                    this.byId("ConsignmentTable").setModel(this._ConsigmentModel, "ConsignmentModel");
                   
                    break;//quit the loop
                }
            }
        },

        onSendVehicle: function () {

        },

        handleEditAdressPress: function () {
            if (this._oDialogAdress === undefined) {
                this._oDialogAdress = sap.ui.xmlfragment("GroupageNamespace.GroupageModule.view.EditPickUpAdress", this);
                //in order to automatically copy add the models to this fragment
                this.getView().addDependent(this._oDialogAdress);
            };

            this._oDialogAdress.open();
        },

        _ConsignmentType_vehicle: function () {
            var dataModel = this.getOwnerComponent().getModel("ConsignmentSizeVehicleData");
            var oItemSelectTemplate = new sap.ui.core.Item({
                key: "{Key}",
                text: "{Description}"
            });
            var oSelect = this.getView().byId("ConsignmentSize");
            oSelect.setModel(dataModel);
            oSelect.bindAggregation("items"
                , "/ConsignmentSizeVehicles", oItemSelectTemplate);
            this.byId("BuyPackaging").setEnabled(false);
            this.byId("ConsignmentType").setValue("Vehicle");
            //this.byId("IdConsignmentType").setSelectedItem("vehicle");
        },

        _ConsignmentType_Parcel: function () {
            var dataModel = this.getOwnerComponent().getModel("ConsignmentSizeCartonData");
            var oItemSelectTemplate = new sap.ui.core.Item({
                key: "{Key}",
                text: "{Description}"
            });
            var oSelect = this.getView().byId("ConsignmentSize");
            oSelect.setModel(dataModel);
            oSelect.bindAggregation("items"
                , "/ConsignmentSizeCartons", oItemSelectTemplate);
            this.byId("BuyPackaging").setEnabled(true);
            this.byId("ConsignmentType").setValue("Carton");

        },

        _ConsignmentType_Pallet: function () {
            var dataModel = this.getOwnerComponent().getModel("ConsignmentSizePalletData");
            var oItemSelectTemplate = new sap.ui.core.Item({
                key: "{Key}",
                text: "{Description}"
            });
            var oSelect = this.getView().byId("ConsignmentSize");
            oSelect.setModel(dataModel);
            oSelect.bindAggregation("items"
                , "/ConsignmentSizePallets", oItemSelectTemplate);
            this.byId("BuyPackaging").setEnabled(true);
            // Das Feld Containertyp wird entsprechend ausgefüllt
            this.byId("ConsignmentType").setValue("Pallet");
        },

        _ConsignmentType_Fcl: function () {
            var dataModel = this.getOwnerComponent().getModel("ConsignmentSizeFclData");
            var oItemSelectTemplate = new sap.ui.core.Item({
                key: "{Key}",
                text: "{Description}"
            });
            var oSelect = this.getView().byId("ConsignmentSize");
            oSelect.setModel(dataModel);
            oSelect.bindAggregation("items"
                , "/ConsignmentSizeFcls", oItemSelectTemplate);
            this.byId("BuyPackaging").setEnabled(true);
            this.byId("ConsignmentType").setValue("FCL");
        },

        closeDialog: function (oEvent) {
            //depending,on which Dialog has been Closed (either PickUp Adress or Consignordialog has been opened)
            oEvent = oEvent.getSource();
            if (oEvent.getId() === "ClosePickUpAdress") {
                this._oDialogAdress.close();
            } else {
                this._handleMessageBoxOpen("Are you sure you want to cancel your report? All Changes will not be saved", "warning");
            }
        },
        onSaveConsignor: function () { 
            //before closing the Consignor first copy the adress to the Consignment adress
            var sConsignmentStreet = this.model.getProperty("/residenceStreet");
            var sConsignmentStreetNr = this.model.getProperty("/residenceStreetNr");
            var sConsignmentPostcode = this.model.getProperty("/residencePostCode");
            var sConsignmentCity = this.model.getProperty("/residenceCity");

            this.model.setProperty("/streetConsignment", sConsignmentStreet);
            this.model.setProperty("/streetNrConsignment", sConsignmentStreetNr);
            this.model.setProperty("/cityConsignment", sConsignmentCity);
            this.model.setProperty("/postCodeConsignmemt", sConsignmentPostcode);


            this._oDialogConsignor.close();
        },

        wizardCompletedHandler: function () {
            this._oNavContainer.to(this._oWizardReviewPage);

        },

        onReadTermsandCond: function () {
            var URLHelper = mobileLibrary.URLHelper;
            URLHelper.redirect("http://www.sap.com", true);
        },

        onChangeSenderLand: function (oEvent) {
            this.senderLandKey = oEvent.getSource().getSelectedKey();
        },

        onChangeDestinationLand: function (oEvent) {
            oEvent = oEvent.getSource();
            //bei jedem landwechsel  soll es geschehen (initialization)
            this.byId("AltCityReceiverLand").setEnabled(false);
            this.byId("AltCityReceiverLand").setValue("");
            this.byId("DeliveryOption").setValue("");

            var sDestinationPort = oEvent.getSelectedKey();

            //initialize seconsection and thirdsection.
            this._initializeSecondSection();
            this._initializeThirdSection();
            //find the right transportroute
            var transRoute = this._getTransportRoute(this.senderLandKey, sDestinationPort);





            //Customize the screen for this TransportRoute            
            this._CustomizeScreenForTransportRoute(transRoute);
            if (sDestinationPort != "DLA") {
                var dataModel = this.getOwnerComponent().getModel("ReceiverLandData");
                var oItemSelectTemplate = new sap.ui.core.Item({
                    key: "{AltCity}",
                    text: "{AltDescription}"
                });
                var oSelect = this.getView().byId("AltCityReceiverLand");
                oSelect.setModel(dataModel);
                oSelect.bindAggregation("items"
                    , "/ReceiverLands/0/AlternativCity", oItemSelectTemplate);
            }
        },



        _getTransportRoute: function (iSenderLand, iDestinationLand) {
            return iSenderLand + "-" + iDestinationLand;
        },

        _SetTransportRouteDerivation: function (iRoutekey) {
            //get the Description of this Route
            var sDescriptionRoute = this.getOwnerComponent().getModel("TransportRouteData").getProperty("/TransportRoutes/" + iRoutekey + "/Description");
            this.byId("RouteFormatted").setHtmlText(sDescriptionRoute);

            //get the ShippingDate and the ArrivalDate
            var sRouteNextShippingDate = this.getOwnerComponent().getModel("TransportRouteData").getProperty("/TransportRoutes/" + iRoutekey + "/NextShipingDate");
            this.byId("NextShipDate").setValue(sRouteNextShippingDate);

            //get the arrival date
            var sRouteArrivalDate = "Estimaded Arrival -" + this.getOwnerComponent().getModel("TransportRouteData").getProperty("/TransportRoutes/" + iRoutekey + "/EstimatedArrivalDate");
            this.byId("ArrivalDateFormattedText").setHtmlText(sRouteArrivalDate);
        },

        _CustomizeScreenForTransportRoute: function (iRoute) {
            var oJsonData = this.getOwnerComponent().getModel("TransportRouteData").getData();
            var indx = this._searchIndexByKey(oJsonData, iRoute);

            //After finding the Index, we show the texts about the transportroute
            this._SetTransportRouteDerivation(indx);

            //deactivate screenpart if necessary
            var sFlexPickUp = this.getOwnerComponent().getModel("TransportRouteData").getProperty("/TransportRoutes/" + indx + "/FlexPickUp");
            if (sFlexPickUp === "false") {
                this._setFlexPickUpOptionunavailble();
            };

            //check if Buypackaging should be availble
            var sBuyPackaging = this.getOwnerComponent().getModel("TransportRouteData").getProperty("/TransportRoutes/" + indx + "/Buyable");
            if (sBuyPackaging === "false") {
                this._setBuyPackagingUnavailble();
            };

            //check if VehicleConsignmentType should be active
            var sVehicleConsType = this.getOwnerComponent().getModel("TransportRouteData").getProperty("/TransportRoutes/" + indx + "/ConsignmentTypeVehicle");
            if (sVehicleConsType === "false") {
                this.byId("vehicleType").setEnabled(false);
            };
        },

        _searchIndexByKey: function (iJsonData, iString) {
            //look after this string in the array
            for (var i = 0; i < iJsonData.TransportRoutes.length; i++) {
                if (iJsonData.TransportRoutes[i].Key === iString);
                return i
            }
        },

        onChangeDestinationOption: function (oEvent) {
            oEvent = oEvent.getSource();
            var sDestinationPort = oEvent.getSelectedItem("value");
            if (sDestinationPort.getText() === "Portcity") {
                this.byId("AltCityReceiverLand").clearSelection;
                this.byId("AltCityReceiverLand").setEnabled(false);
            } else {
                this.byId("AltCityReceiverLand").setEnabled(true);
            }
        },

        onPayMethodChange: function (oEvent) {
            
            var sPayMethod = oEvent.getParameter("item").getText();
            this.model.setProperty("/payOption", sPayMethod);
        },

        onCartonDeliverchange: function (oEvent) {
            oEvent = oEvent.getSource();
            if (oEvent.getState() === true) {
                this._order_Packaging(true)
            } else {
                //this.byId("WarningCommandpackaging").setVisible(false);
                this._order_Packaging(false)
            }
        },

        _order_Packaging: function (booleanValue) {
            this.byId("WarningCommandpackaging").setVisible(booleanValue);
            this.byId("BuyPackaging").setState(booleanValue);
        },

        onConsignmentSizeChange: function (oEvent) {
            //Big Size cannot be pick up with the "Fixe Option"
            oEvent = oEvent.getSource();
            var sConsignmentSizeChangePath = oEvent.getSelectedItem("value").getBindingContext().getPath();
            this.byId("PickUpOptionFlex").setEnabled(true);
            this._initializeThirdSection();
            debugger;
            //initialize the third secftion and hide all the messages       
            this._initializeThirdSection();

            //control, if the customer can command this size
            var sBuyable = this.getView().byId("ConsignmentSize").getModel().getProperty(sConsignmentSizeChangePath + "/Buyable");
            if (sBuyable == "true") {
                this.byId("BuyPackaging").setEnabled(true);
            } else {
                this._setBuyPackagingUnavailble();
            }
        },

        _initializeThirdSection: function () {
            this.byId("PickUpOption").setSelectedItem("Dummy");
            this.byId("PickUpBigConsignment").setVisible(false);
            this.byId("bringyourself").setVisible(false);
            this.byId("SelectFlexDateWarning").setVisible(false);
            this.byId("SelectBringYourself").setVisible(false);
            this.byId("BigSizeFlexImpossible").setVisible(false);
            this.byId("LocationId").setVisible(false);
        },

        _initializeSecondSection: function () {
            this.byId("vehicleType").setEnabled(true);
            this.byId("fclType").setEnabled(true);
            this.byId("palletType").setEnabled(true);
            this.byId("cartonType").setEnabled(true);
            this.byId("BuyPackaging").setEnabled(true);
        },

        _setFlexPickUpOptionunavailble: function () {
            this.byId("BigSizeFlexImpossible").setVisible(true);
            this.byId("PickUpOptionFlex").setEnabled(false);
        },

        _setBuyPackagingUnavailble: function () {
            this.byId("BuyPackaging").setEnabled(false);
        },

        OnDatePickUpChange: function (oEvent) {
            var oDP = oEvent.getSource();
            var sValue = oEvent.getParameter("value");
            var bValid = "";

            if (bValid) {
                oDP.setValueState("Success");
            } else {
                oDP.setValueState("Error");
            }
        },
        handleWizardCancel: function () {
            this._handleMessageBoxOpen("Are you sure you want to cancel your report? All Changes will not be saved", "warning");
        },

        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        //When we cancel the transaction, we return to the Home 
                        sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteHome")
                    }
                }.bind(this)
            });
        },

        factoryFunctionLocation: function (sId, oContext) {
            var oUIControl;
            // Decide based on the data which dependent to clone
            if (oContext.getProperty("RepresentationTyp") === "Shop") {
                oUIControl = this.byId("LocationShop").clone(sId);
                // The item is a Shop, so we will add a status
                if (oContext.getProperty("City") === "Bordeaux") {
                    oUIControl.addAttribute(new sap.m.ObjectAttribute({
                        text: {
                            path: "i18n>ContactBeforePass"
                        }
                    }))
                }
            } else {
                // The item is available, so we will create an ObjectListItem
                oUIControl = this.byId("LocationFilliale").clone(sId);
            }
            return oUIControl;
        },


        _OpenConsignorDialog: function () {
            if (this._oDialogConsignor === undefined) {
                this._oDialogConsignor = sap.ui.xmlfragment("GroupageNamespace.GroupageModule.view.ConsignorInfo", this);
                //in order to automatically copy add the models to this fragment
                this.getView().addDependent(this._oDialogConsignor);
            };
            this._oDialogConsignor.open();

        },
        onSeeOurContact: function (oEvent) {
            this.openContactUsFragment(oEvent)
        }
        //https://ui5.sap.com/#/entity/sap.ui.layout.form.Form/sample/sap.ui.layout.sample.Form354
        //https://ui5.sap.com/#/entity/sap.m.Wizard/sample/sap.m.sample.Wizard/code

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf GroupageNamespace.Groupageproject.view.newOrder
		 */
        //	onBeforeRendering: function() {
        //
        //	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf GroupageNamespace.Groupageproject.view.newOrder
		 */
        //	onAfterRendering: function() {
        //
        //	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf GroupageNamespace.Groupageproject.view.newOrder
		 */
        //	onExit: function() {
        //
        //	}

    });

});