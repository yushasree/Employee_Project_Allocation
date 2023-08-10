// namespace my.employee.project;

// entity Employee {
//   Key EmpID : Integer;
//   Name : String(20);
//   Designation : String(20);
//   Department : String(20);
//   DateOfJoining : Date;
//   Email : String(30);
//   ContactNumber : String(15);
//   Location : String(20);
//   Employeetype : String(20);
    
  
// }

// entity Project {
//   Key ProjectID : Integer;
//   Name : String(25);
//   Description : String(20);
//   StartDate : Date;
//   EndDate : Date;
//   EmpID : Integer;
//   ProjectPriority : String(20);
//   ProjectStatus  : String(20);
//   ClientName  : String(20);
// }

namespace my.employee.project;

entity Employee {
  key EmpID : String(10);
  Name : String(20);
  Designation : String(20);
  Department : String(20);
  DateOfJoining : Date;
  Email : String(30);
  ContactNumber : String(15);
  Location : String(20);
  Employeetype : String(20);
  to_Project : Association[0..*] to Project on to_Project.EmpID = $self.EmpID;
  
}

entity Project {
  key ProjectID : String(10);
  ProjectName : String(25);
  Description : String(100);
  StartDate : Date;
  EndDate : Date;
  EmpID : Integer;
  ProjectPriority : String(20);
  ProjectStatus : String(20);
  ClientName : String(20);
  to_Employee : Association[0..1] to Employee on to_Employee.EmpID = $self.EmpID;
}
