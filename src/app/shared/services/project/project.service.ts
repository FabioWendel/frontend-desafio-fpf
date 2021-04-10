import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../../models/project.model';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = environment.dataBaseConfig.databaseURL;


  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getProjects(): Observable<any> {
    return this.httpClient.get<Project[]>(`${this.apiUrl}projects`)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  getProjectById(id: number): Observable<Project> {
    return this.httpClient.get<Project>( `${this.apiUrl}projects/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  saveProject(project: Project): Observable<Project> {
    console.log(project)
    return this.httpClient.post<Project>(`${this.apiUrl}projects`,JSON.stringify(project),this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  updateProject(id:Project, project: Project): Observable<Project> {
    return this.httpClient.put<Project>(`${this.apiUrl}projects/${id.id}`,JSON.stringify(project), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  deleteProject(project: Project) {
    return this.httpClient.delete<Project>( `${this.apiUrl}projects/${project.id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };


}

