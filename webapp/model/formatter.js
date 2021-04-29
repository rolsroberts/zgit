sap.ui.define([] , function () {
	"use strict";

	return {
		/**
		 * Defines a value state based on the stock level
		 *
		 * @public
		 * @param {number} iValue the stock level of a product
		 * @returns {string} sValue the state for the stock level
		 */
		PaymentState: function(iValue) {
			if (iValue === "Not Paid") {
				return "Error";
			} else {
				return "Success";
            };
        },
        
        adress: function(City,Postcode,Street,HouseHolder){
             return Street + "," + Postcode + " in " + City + " bei " + HouseHolder;

        },
        PriceState: function(iValue){
			return "Information";
        },
        PriceAmount:function(OrderPrice){
            debugger;
            return OrderPrice
        },
        ProgressIndicatorOrder:function(ProcessingStatus){
            if (ProcessingStatus==="Ready to be shipped"){
                return "50%"
            }   
        },

        OrderStatusIcon: function(OrderStatus){ 
            debugger;
            if (OrderStatus ==="Canceled") {
                return "sap-icon://decline";
            } 
            else if (OrderStatus==="Completed") {
                return "sap-icon://accept";}
             else if (OrderStatus==="Pending"){                
                return "sap-icon://process"
            }
        },

        ConsignmentTypeIcon:function(sConsignmentType){ 

            if (sConsignmentType = "Vehicle"){
                return "sap-icon://shipping-status";
            } else if (sConsignmentType = "Carton"){
                return "sap-icon://database";
            } else if (sConsignmentType = "Pallet"){
                return "sap-icon://grid";
            } else if (sConsignmentType = "FCL"){
                return "";
            }

        },




        
        PickUpText_yes_or_no: function (iPickUpOption, iPickUpdate) {
            //var oResourceBundle = this.getView("ExistingOrder").getModel("i18n").getProperty("yes");
            //var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            //return finalText + resourceBundle.getText("StatusA");
            //http://www.amarmn.com/sapui5-custom-formatter-functions-how-to-use-part-8-sapui5-tutorial-for-beginners/
           	//var bundle =  sap.ui.getCore().getModel("i18n").getProperty("yes");
           // var resourceBundle = this.getView("ExistingOrder").getModel("i18n").getResourceBundle();

          //  if (iPickUpOption ==="fixe" ) {
          //      return oResourceBundle.getText("yes") + "," +"iPickUpdate";                
         //} else if (iPickUpOption ==="flexible" ) {
         //       return oResourceBundle.getText("yes") + "," + "iPickUpdate";
         // } else {
             //   return oResourceBundle.getText("yes");
        // }
        
            
           //   return iPickUpDate +  "," + iPickUpStreet + ", in " + iPickUpPostcode + iPickUpCity + " bei " + iPickUpHouseHolder;
        },

        RestingDateBeforeShipping: function(shippingDate){
            debugger;
            var newShippingDate = shippingDate.replaceAll(".","-");
            
            //Today Date
            var today   = new Date();
            var sDay = today.getDate() ;
            var sMonth = today.getMonth() + 1 ;
            var sYear = today.getFullYear();

            if (sMonth<10){sMonth= '0'+sMonth}; //if month is 9, change to 09
            if (sDay<10){sMonth= '0'+sDay};
            var sToday= sYear+'-'+sMonth+'-'+sDay; //2020-12-23

            //transform into Object 
            var oToday = new Date(sToday);
            var oNextShipping = new Date(newShippingDate);
           
            //Difference
            var diffDays = Math.abs(oToday.getTime() - oNextShipping.getTime());
            var diffDays = Math.ceil(diffDays / (1000 * 60 * 60 * 24)); 

            if (diffDays < 0) {
                diffDays = '0';
                return diffDays + " days left";
            } else {
                return diffDays + " days left" ;
            }
        }
    }

})