import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectService } from '../shared/services/project/project.service';

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
  controlSubmit: boolean = false;
  submitted: boolean;
  error:any={isError:false,errorMessage:''};



  @ViewChild('myTemplate') customTemplate: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  level_risk: {name:string, value: string; }[];
  isValidDate: boolean;
  totalPages: any;


  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.getProjects();
    this.getLevelRisk();
    this.userform = this.fb.group({
      'name': new FormControl('', Validators.required),
      'date_init': new FormControl('', Validators.required),
      'date_finish': new FormControl('', Validators.required),
      'value_project': new FormControl('', Validators.required),
      'risk_project': new FormControl('', Validators.required),
      'participants': this.fb.array([]),
    });
  }

  validateDates(sDate: string, eDate: string){
    this.isValidDate = true;
    if((sDate == null || eDate ==null)){
      this.error={isError:true,errorMessage:'A data de início e a data de término são obrigatórias.'};
      this.isValidDate = false;
    }

    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      this.error={isError:true,errorMessage:'A data de término deve ser maior que a data de início.'};
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

  participants() : FormArray {
    return this.userform.get("participants") as FormArray
  }

  newItem(): FormGroup {
    return this.fb.group({
      'name': new FormControl('', Validators.required),
      'cpf': new FormControl('', Validators.required),
    })
  }

  getItem(): FormGroup {
    return this.fb.group({
      'name': new FormControl('', Validators.required),
      'cpf': new FormControl('', Validators.required),
    })
  }

  addItem() {
    this.participants().push(this.newItem());
  }

  editItem(){
    this.participants().push(this.getItem());
  }

  removeItem(i:number) {
    this.participants().removeAt(i);
  }

  onSubmit() {
    const { date_init, date_finish } = this.userform.value;
    this.validateDates(date_init, date_finish);

    this.submitted = true;
    if (this.userform.invalid || !this.isValidDate) {
      return;
    }
    console.log(this.userform.value)

    if (this.controlSubmit == true) {
      this.dialog.closeAll();
    } else if (this.controlSubmit == false) {
      this.dialog.closeAll();
    }

  }

  getLevelRisk(){
    this.level_risk = [
      {name:"Baixo", value: "0"},
      {name:"Médio",value: "1"},
      {name:"Alto",value: "2"},
    ];
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe(data => {
      console.log(data);
      this.projects = new MatTableDataSource(data);
      this.projects.sort = this.sort;
      this.isLoading = false;
    }, error => {
      // this.toastr.error('Falha na comunicação com servidor!', 'Erro!');
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

  }

  openDialog() {
    this.error={isError:false,errorMessage:''};
    this.userform.reset();
    this.participants().clear();
    this.addItem();
    const dialogRef = this.dialog.open(this.customTemplate, {width:'850px'});
  }

  getCurrent(event){

  }


}
