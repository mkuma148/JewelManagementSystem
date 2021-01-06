import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanize'
})
export class FilterPipe implements PipeTransform {

  // transform(employees: any,  term: any): unknown {
  //   if(term === undefined) return employees;

  //   // return employees.filter(employee => employee.name.startsWith(term) !== -1);
  //   return employees.filter(function(employee){
  //     return employee.name.toLowerCase().startsWith(term.toLowerCase());
  //   }
  //   )
  // }

  // transform(value: string) {
  //   if ((typeof value) !== 'string') {
  //   return value;
  //   }
  //   value = value.split(/(?=[A-Z])/).join(' ');
  //   value = value[0].toUpperCase() + value.slice(1);
  //   return value;
  //   }

  transform(value: string) {
    if (value === '') {
    return value;
    }
    
    value = value.replace(/([^A-Z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][^A-Z])/g, '$1 $2');
    value = value[0].toUpperCase() + value.slice(1);
    return value;
    }

}
