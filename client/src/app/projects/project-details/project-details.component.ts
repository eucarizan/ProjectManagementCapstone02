import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/_models/projects';
import { ProjectsService } from 'src/app/_services/projects.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;
  validationErrors: string[] = [];

  constructor(private projectService: ProjectsService, private route: ActivatedRoute, 
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadProject();
  }

  loadProject() {
    this.projectService.getProject(this.route.snapshot.paramMap.get('projectname')).subscribe(project => {
      // console.log(this.route.snapshot.paramMap.get('projectname'));
      this.project = project;
      console.log('project_details_component', project);
    })
  }

  removeMember(username: string) {
    // alert('do you want to remove member?');
    var newObj: any = {
      projectid: this.project.id,
      username: username
    }

    this.projectService.removeMemberToProject(newObj).subscribe({
      next: () => {
        // console.log("removed user");
        this.toastr.success("Member removed");
        this.loadProject();
      },
      error: e => {
        this.validationErrors = e;
      }
    })

  }

}
