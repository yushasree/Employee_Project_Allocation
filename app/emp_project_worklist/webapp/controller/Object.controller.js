sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, History, formatter, MessageBox) {
    "use strict";

    return BaseController.extend("empprojectworklist.controller.Object", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                    busy : true,
                    delay : 0
                });
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack : function() {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line fiori-custom/sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched : function (oEvent) {
            this.getView().byId("isNew").setState(false);
            var sObjectId =  oEvent.getParameter("arguments").objectId;
            this._bindView("/Employee" + sObjectId);
            // this.bindLeaveRequestTable();

    
        },

        // bindLeaveRequestTable: function()
        // {
        //     var leavereqTable = this.getView().byId("proTable");
        //     var leavereqItems = this.getView().byId("pItems").clone();
        //     var employeeId = this.getView().byId("employeeTitle").getText();
        //     var empId = [new Filter("EmpID", FilterOperator.EQ, employeeId)];
        //     leavereqTable.bindAggregation("items",{path:"/Project",template:leavereqItems, 
        //     filters:empId});
        // },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView : function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                        this._onBindingChange();  //  _onBindingChange method call
                    }.bind(this)  
                    
                }
            });

            
        },

        _onBindingChange : function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }
            var oObject = oView.getBindingContext().getObject();
        
           
                        // if (oObject) {
            var oResourceBundle = this.getResourceBundle(),
            
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.EmpID,
                sObjectName = oObject.Employee;

                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/shareSendEmailSubject",
                    oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
                oViewModel.setProperty("/shareSendEmailMessage",
                    oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
                                    //  }
        },
        onNewEmployee: function(oEvent)

        {
            //debugger;
            if(oEvent.getParameter("state"))
            {
                this.getView().byId("empid").setEnabled(true);
                this.getView().byId("empid").setValue();
                this.getView().byId("Name").setValue();
                this.getView().byId("Designation").setValue();
                this.getView().byId("DOJ").setValue();
                this.getView().byId("Email").setValue();
                this.getView().byId("ContactNumber").setValue();
                this.getView().byId("Location").setValue(); 
                this.getView().byId("Employeetype").setValue();
                this.getView().byId("Department").setValue();
            }
            else
            this.getView().byId("empid").setEnabled(false);
        },

        onDeleteEmployee: function(oEvent)
        {
            var oModel = this.getView().getModel();
            oModel.setUseBatch(false);
            var empId = this.getView().byId("empid").getValue();

            oModel.remove("/Employee('"+empId+"')", {               
                success: function(data) {                  
                   sap.m.MessageBox.information("Employee Deleted", {
                        actions: [MessageBox.Action.CLOSE],                      
                        onClose: function (sAction) {
                            referThis.onNavBack();
                        }
                    });
                },
                error: function(oError) {                      
                }
            });
        },

        onSaveEmployees: function(oEvent){

            // console.log(this.getView().byId("empdetailsform"));

            var oModel = this.getView().getModel();
            var empChanges = {};
            // var selObject = this.getView().byId("empdetailsform").getBindingContext().getObject();
            // console.log("selObject: ", selObject); 
            // empChanges.EmpID  = selObject.EmpID;

            
            var EmpID = this.getView().byId("empid").getValue();
            var Name = this.getView().byId("Name").getValue();
            var Designation = this.getView().byId("Designation").getValue();
            var Email = this.getView().byId("Email").getValue();
            var ContactNumber = this.getView().byId("ContactNumber").getValue();
            var Department = this.getView().byId("Department").getValue();
            var Location = this.getView().byId("Location").getValue();
            var Employeetype = this.getView().byId("Employeetype").getValue();

            empChanges.EmpID = EmpID;
            empChanges.Name = Name;
            empChanges.Designation = Designation;
            empChanges.Email = Email;
            empChanges.ContactNumber = ContactNumber;
            empChanges.Department = Department;
            empChanges.Location = Location;
            empChanges.Employeetype = Employeetype;
            
            var isNew = this.getView().byId("isNew").getState();

            if(isNew)
            {
                oModel.create("/Employee", empChanges, {                
                    success: function (data,response) {                                         
                        sap.m.MessageToast.show("New Employee Created");                  
                    },
                    error: function (oError) {                  
                    }
                }); 
            }
            else
            {
            oModel.update("/Employee('"+empChanges.EmpID+"')", empChanges, {                
                success: function (data,response) {                                         
                   sap.m.MessageToast.show("Employee Information Updated");  
                //    referThis.bindLeaveRequestTable();                   
                },
                error: function (oError) {                  
                }
            }); 
          }
        },


        onSaveProject: function(oEvent){

            // console.log(this.getView().byId("empdetailsform"));
            debugger;
            var oModel = this.getView().getModel();
            var projChanges = {};
            // var selObject = this.getView().byId("empdetailsform").getBindingContext().getObject();
            // console.log("selObject: ", selObject); 
            // empChanges.EmpID  = selObject.EmpID;

           var ProjectID = this.getView().byId("projectid").getValue();
           var EmpID = this.getView().byId("empid").getValue();
           var ProjectName = this.getView().byId("projectname").getValue();
            var Description = this.getView().byId("Description").getValue();
            var StartDate = this.getView().byId("StartDate").getValue();
            var EndDate = this.getView().byId("EndDate").getValue();
            var ProjectPriority = this.getView().byId("ProjectPriority").getValue();
            var ProjectStatus = this.getView().byId("ProjectStatus").getValue();
            var ClientName = this.getView().byId("ClientName").getValue();

            
            
            projChanges.ProjectID = ProjectID;
            projChanges.EmpID = EmpID;
            projChanges.ProjectName = ProjectName;
            projChanges.Description = Description;
            projChanges.ProjectPriority = ProjectPriority;
            projChanges.StartDate = StartDate;
            projChanges.EndDate = EndDate;
            
            projChanges.ProjectStatus = ProjectStatus;
            projChanges.ClientName = ClientName;

            var resetProjectFields = function() {
                this.getView().byId("projectid").setValue("");
                this.getView().byId("empid").setValue("");
                this.getView().byId("projectname").setValue("");
                this.getView().byId("Description").setValue("");
                this.getView().byId("StartDate").setValue("");
                this.getView().byId("EndDate").setValue("");
                this.getView().byId("ProjectPriority").setValue("");
                this.getView().byId("ProjectStatus").setValue("");
                this.getView().byId("ClientName").setValue("");
            }.bind(this); 
            
            var isNewProject = this.getView().byId("isNewProject").getState();

            if(isNewProject)
            {
                oModel.create("/Project", projChanges, {                
                    success: function (data,response) {                                         
                        sap.m.MessageToast.show("New Project Created");                  
                    },
                    error: function (oError) {                  
                    }
                }); 
            }
            else
            {
            oModel.update("/Project('"+projChanges.ProjectID+"')", projChanges, {                
                success: function (data,response) {                                         
                   sap.m.MessageToast.show("Project Information Updated");  
                   resetProjectFields();                
                },
                error: function (oError) {                  
                }
            }); 
          }
        },
        
            // oModel.update("/Employee('"+empChanges.EmpID+"')", empChanges,{ 
            //     success: function (data, response) { 
            //         sap.m.MessageToast.show("Changes saved"); 
            //     },
            //     error: function (oError) { 
            //         // Handle the error here
            //     }
            // }); 

            // oModel.update("/Employee('"+empChanges.EmpID+"')", empChanges, {
            //     method: "PUT",
            //     success: function (data, response) { 
            //         // Handle success here
            //     },
            //     error: function (oError) { 
            //         // Handle the error here
            //     }
            // }); 
    // },
            
    onProjectReqPress: function(oEvent)
    {
        //var sObjectId =  oEvent.getParameter("arguments").objectId;
        var sObjectPath = oEvent.getSource().getBindingContext().sPath;

        this.getView().byId("ProjectDetails").bindElement({
            path: sObjectPath,
            events: {
                change: this._onBindingChange.bind(this)                   
            }
        });
    },  
    
    onNewProject: function(oEvent)

        {
            //debugger;
            if(oEvent.getParameter("state"))
            {
                this.getView().byId("projectid").setEnabled(true);
                this.getView().byId("projEmpID").setEnabled(false);
                this.getView().byId("projectname").setValue();
                this.getView().byId("Description").setValue();
                this.getView().byId("StartDate").setValue();
                this.getView().byId("EndDate").setValue();
                this.getView().byId("ProjectPriority").setValue();
                this.getView().byId("ProjectStatus").setValue(); 
                this.getView().byId("ClientName").setValue();
                
            }
            else
            this.getView().byId("empid").setEnabled(false);
        },

        
        
        
        onAddProject: function() {
            this.getRouter().navTo("newproject");
        }
        
        



        
        
    });

});




