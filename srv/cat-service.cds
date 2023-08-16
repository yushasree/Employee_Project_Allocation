using my.employee.project  as my from '../db/data-model';
using {sf as external} from './external/sf.csn';

service CatalogService {
     entity Employee as projection on my.Employee;
     entity Project as projection on my.Project;
     entity ChangeLog as projection on my.ChangeLog;
     entity Position as projection on external.Position;
     entity PerPersonal as projection on external. PerPersonal;

}
