import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Project } from '../shared/models/project.model';
import { ProjectService } from '../shared/services/project/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  displayedColumns: string[] = ['name', 'date_init', 'date_finish', 'value_project', 'risk_project', 'opcao'];
  projects: MatTableDataSource<Project>;

  userform: FormGroup;
  isLoading = true;
  controlSubmit: boolean = false;
  submitted: boolean;
  error: any = { isError: false, errorMessage: '' };



  @ViewChild('myTemplate') customTemplate: TemplateRef<any>;
  @ViewChild('myTemplateDelete') customTemplateDelete: TemplateRef<any>;
  @ViewChild('myTemplateInvestment') customTemplateInvestment: TemplateRef<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  level_risk: { name: string, value: number; }[];
  isValidDate: boolean;
  controlDelete: boolean;
  dataFormItem: any;
  dataCurrent: any;
  valueInvestment: number;
  valueRetorneInvestment: number;
  riskProject: number;
  valueProject: number;
  controlResult: boolean;
  valueInvestmentFix: number;
  controlMessageError: boolean;


  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
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

  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate == null || eDate == null)) {
      this.error = { isError: true, errorMessage: 'A data de início e a data de término são obrigatórias.' };
      this.isValidDate = false;
    }

    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      this.error = { isError: true, errorMessage: 'A data de término deve ser maior que a data de início.' };
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

  participants(): FormArray {
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
      'name': new FormControl(this.dataFormItem.name, Validators.required),
      'cpf': new FormControl(this.dataFormItem.cpf, Validators.required),
    })
  }

  addItem() {
    this.participants().push(this.newItem());
  }

  editItem() {
    this.participants().push(this.getItem());
  }

  removeItem(i: number) {
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
      this.postProject(this.userform.value);
      this.getProjects();
      this.dialog.closeAll();
    } else if (this.controlSubmit == false) {
      this.updateProject(this.userform.value);
      this.getProjects();
      this.dialog.closeAll();
    }

  }

  getLevelRisk() {
    this.level_risk = [
      { name: "Baixo", value: 0 },
      { name: "Médio", value: 1 },
      { name: "Alto", value: 2 },
    ];
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = new MatTableDataSource(data);
      this.dataCurrent = data;
      this.projects.sort = this.sort;
      this.projects.paginator = this.paginator;
      this.isLoading = false;
    }, error => {
      this.toastr.error('Falha na comunicação com servidor!', 'Erro!');
    });
  }

  postProject(project: Project): void {
    this.projectService.saveProject(project).subscribe(() => {
      this.toastr.success('Cadastrado!', 'Sucesso!');
      this.isLoading = true;
      this.getProjects();
    }, err => {
      this.toastr.error('Falha na comunicação com servidor!', 'Erro!');
    });
  }

  deleteProject(): void {
    let a;
    this.projectService.deleteProject(this.dataFormItem)
      .subscribe(() => {
        this.isLoading = true;
        this.getProjects();
        this.dialog.closeAll();
        this.toastr.success('Deletado!', 'Sucesso!');
      }, err => {
        this.toastr.error('Falha na comunicação com servidor!', 'Erro!');
      });
  }

  updateProject(project: Project): void {
    this.projectService.updateProject(project, project)
      .subscribe((ans) => {
        this.toastr.success('Atualizado!', 'Sucesso!');
        this.isLoading = true;
        this.getProjects();
      }, err => {
        this.toastr.error('Falha na comunicação com servidor!', 'Erro!');
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projects.filter = filterValue.trim().toLowerCase();

    if (this.projects.paginator) {
      this.projects.paginator.firstPage();
    }
  }

  openDialog() {
    this.controlSubmit = true;
    this.controlDelete = false;
    this.error = { isError: false, errorMessage: '' };
    this.userform.reset();
    this.participants().clear();
    this.addItem();
    this.userform.enable()
    const dialogRef = this.dialog.open(this.customTemplate, { width: '850px' });
  }

  openDialogEdit(project) {
    project.date_init = project.date_init.substring(0, 10);
    project.date_finish = project.date_finish.substring(0, 10);
    this.error = { isError: false, errorMessage: '' };
    this.dataFormItem = project;
    this.participants().clear();
    this.dataFormItem.participants.forEach(() => {
      this.editItem();
    });
    this.controlSubmit = false;
    this.controlDelete = true;
    this.userform.enable()
    this.userform.patchValue(project);
    const dialogRef = this.dialog.open(this.customTemplate, { width: '850px' });
  }

  openDialogIvenstment(project) {
    this.controlMessageError = false;
    this.valueInvestment = null;
    this.controlResult = false;
    project.date_init = project.date_init.substring(0, 10);
    project.date_finish = project.date_finish.substring(0, 10);
    this.error = { isError: false, errorMessage: '' };
    this.dataFormItem = project;
    this.participants().clear();
    this.dataFormItem.participants.forEach(() => {
      this.editItem();
    });
    this.userform.patchValue(project);
    this.userform.disable()
    const dialogRef = this.dialog.open(this.customTemplateInvestment, { width: '850px' });


  }

  openDialogDelete() {
    const dialogRef = this.dialog.open(this.customTemplateDelete);
  }

  getCurrent(event) {
    console.log(event.pageIndex)
    this.isLoading = true;
    const skip = this.paginator.pageSize * this.paginator.pageIndex;
    const paged = this.dataCurrent.filter((u, i) => i >= skip)
      .filter((u, i) => i < this.paginator.pageSize);
    console.log(paged);
    this.projects = new MatTableDataSource(paged);
    this.isLoading = false;
  }

  validValueInvestment() {

  }

  simulateInvestment() {
    this.riskProject = +this.dataFormItem.risk_project;
    this.valueProject = +this.dataFormItem.value_project;

    if (this.valueInvestment > this.valueProject) {
      this.valueInvestmentFix = +this.valueInvestment;
      this.controlResult = true;
      this.controlMessageError = false;
      if (this.riskProject == 0) {
        this.valueRetorneInvestment = (5 / 100) * this.valueInvestment;
      } else if (this.riskProject == 1) {
        this.valueRetorneInvestment = (10 / 100) * this.valueInvestment;
      } else {
        this.valueRetorneInvestment = (20 / 100) * this.valueInvestment;
      }
    } else {
      this.controlMessageError = true;
    }
  }


}
