import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Project } from '../_models/projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  baseUrl = environment.apiUrl;
  projects: Project[] = [];

  constructor(private http: HttpClient) { }

  getProjects() {
    return this.http.get<Project[]>(this.baseUrl + 'projects' ).pipe(
      map(response => {
        this.projects = response;
        return response;
      })
    );
  }

  getProjectsByManager(id: number) {
    return this.http.get<Project[]>(this.baseUrl + 'projects/manager/' + id).pipe(
      map(response => {
        this.projects = response;
        return response;
      })
    );
  }

  getProject(projectname: string) {
    // const project = this.projects.find(x => x.projectName == projectname);
    // console.log('project_service ', project);
    // if(project !== undefined) return of(project);
    return this.http.get<Project>(this.baseUrl + 'projects/' + projectname);
  }

  // api/projects/update/7
  updateProject(id: number, project: Project) {
    return this.http.put(this.baseUrl + 'projects/update/' + id, project);
  }

  addProject(project: Project) {
    return this.http.post(this.baseUrl + 'projects/addproject', project);
  }

  deleteProject(id: number) {
    return this.http.delete(this.baseUrl + 'projects/delete/' + id);
  }
  
  addMemberToProject(data: any, project: Project) {
    return this.http.put(this.baseUrl + 'projects/addmember', data).pipe(
      map((response: Project) => {
        var idx = this.projects.indexOf(project);
        this.projects[idx] = response;
      })
    );
  }

  removeMemberToProject(data: any) {
    return this.http.put(this.baseUrl + 'projects/removemember', data);
  }

}
