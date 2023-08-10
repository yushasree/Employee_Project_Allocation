sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("empprojectworklist.controller.newproject", {

        

        onInit : function () {
           
        },
        onSaveProject: function() {
            var oModel = this.getView().getModel();
            var oData = this.byId("AddProjectForm").getBindingContext().getObject();
            
            // Save oData to backend service, and once successful, navigate back:
        
            // pseudo-code to illustrate:
            oModel.create("/ProjectSet", oData, {
                success: function() {
                    // Navigation back to main view
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("mainViewRouteName");  // Assuming your main view route is named "mainViewRouteName"
                }.bind(this),
                error: function() {
                    sap.m.MessageToast.show("Error saving project");
                }
            });
        }
        
    });

});