using my.employee.project  as my from '../db/data-model';

service CatalogService {
     entity Employee as projection on my.Employee;
     entity Project as projection on my.Project;
}