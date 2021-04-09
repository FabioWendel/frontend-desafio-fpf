import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  
  displayedColumns: string[] = ['name', 'date_init', 'date_finish', 'value_project', 'risk_project', 'opcao'];
  cadastros: MatTableDataSource<any>;

  userform: FormGroup;
  isLoading = true;

  @ViewChild('myTemplate') customTemplate: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  submitted: boolean;
  controlDelete = false;
  cadastroKey: any;
  controlSubmit: boolean = false;

  municipios: any[] = [];
  filteredListMunicipios: [];
  dataFormItem: any;

  filteredListItems: any[];


  filterInputRow = {};
  totalPages: any;

  constructor() { }

  ngOnInit(): void {
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

  }

  openDialog() {

  }
  
  getCurrent(event){

  }


}
