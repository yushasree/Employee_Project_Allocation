// const cds = require('@sap/cds');

// module.exports = cds.service.impl(async function() {  
    
//     this.before('CREATE','Employee', validateEmployeeCreate);
//     this.on('UPDATE','Employee', validateEmployeeChanges); 
// });

// const validateEmployeeCreate = async (req) => 
// {
//     if(req.data.EmpID.length>5)
//     return req.reject({code:"500", message: "Invalid Employee Id, Cannot be more than 5 chars"}); 
//     else
//     return req.info({code:"200", message: "New Employee Created"}); 
// }

// const validateEmployeeChanges = async (req) => 
// {
//     console.log("Request data from UI:",req.data);
//     if(req.data.Name==="")
//     return req.reject({code:"500", message: "Employee Name cannot be Empty"}); 
//     else
//     return req.info({code:"200", message: "Employee Changes Saved"});
// }


const cds = require('@sap/cds');
const crypto = require("crypto");
const {Project,ChangeLog} = cds.entities('my.employee.project');

module.exports = cds.service.impl(async function() {  
    
    this.before('CREATE','Employee', validateEmployeeCreate);
    this.on('UPDATE','Employee', validateEmployeeChanges); 
    this.before('DELETE','Employee', validateEmployeeDelete); 
});
const validateEmployeeDelete = async (req) => 
{
    var empId = req.data.EmpID;
    var projectList = await SELECT.from(Project ).where({EmpID:empId});
    console.log("Emp Project req.", projectList);
    
    if(projectList.length>0)
    {
        return req.reject({code:"400",message:"Employee has project Pending, Cannot be deleted"});
    }
    else
    // req.info({code:"200", message: "Employee Deleted"}); 
{
    const uuid = crypto.randomUUID();
    var insertedRecords = await INSERT.into(ChangeLog).values(uuid, empId, new Date());
    console.log("insertedRecords",insertedRecords);
    req.info({code:"200", message: "Employee Deleted"}); 
}
    
}
const validateEmail = (email) => {
    var emailRegEx = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegEx.test(email);
}

const validateContactNumber = (number) => {
    var contactNumberRegEx = /^\d{10}$/;
    return contactNumberRegEx.test(number);
}

const validateEmployeeCreate = async (req) => 
{
    if(req.data.EmpID.length>5)
    return req.reject({code:"500", message: "Invalid Employee Id, Cannot be more than 5 chars"}); 

    if(!validateEmail(req.data.Email))
    return req.reject({code:"500", message: "Invalid Email Address"}); 

    if(!validateContactNumber(req.data.ContactNumber))
    return req.reject({code:"500", message: "Invalid Contact Number"}); 

    return req.info({code:"200", message: "New Employee Created"}); 
}

const validateEmployeeChanges = async (req) => 
{
    console.log("Request data from UI:",req.data);

    if(req.data.Name==="")
    return req.reject({code:"500", message: "Employee Name cannot be Empty"}); 

    if(req.data.Email && !validateEmail(req.data.Email))
    return req.reject({code:"500", message: "Invalid Email Address"}); 

    if(req.data.ContactNumber && !validateContactNumber(req.data.ContactNumber))
    return req.reject({code:"500", message: "Invalid Contact Number"}); 

    return req.info({code:"200", message: "Employee Changes Saved"});
}
