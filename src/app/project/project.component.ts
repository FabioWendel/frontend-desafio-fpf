import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
  projects: MatTableDataSource<any>;

  userform: FormGroup;
  isLoading = true;

  @ViewChild('myTemplate') customTemplate: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  submitted: boolean;


  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.userform = this.fb.group({
      'name': new FormControl('', Validators.required),
      'date_init': new FormControl('', Validators.required),
      'date_finish': new FormControl('', Validators.required),
      'value_project': new FormControl('', Validators.required),
      'risk_project': new FormControl('', Validators.required),
      'participants': this.fb.array([]),
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

  }

  openDialog() {
    const dialogRef = this.dialog.open(this.customTemplate);
  }

  getCurrent(event){

  }


}
