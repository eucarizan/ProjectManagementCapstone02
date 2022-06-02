import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { Project } from 'src/app/_models/projects';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { ProjectsService } from 'src/app/_services/projects.service';

@Component({
  selector: 'app-team-proj',
  templateUrl: './team-proj.component.html',
  styleUrls: ['./team-proj.component.css']
})
export class TeamProjComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project;
  selectedYear: number;
  years: number[] = [2019, 2020, 2021];
  teaminfo: {} = {};
  user: User;

  memberCount: number = 0;
  totalCost: number = 0;
  taskCount: number = 15;
  
  addProjectForm: FormGroup;
  validationErrors: string[] = [];

  constructor(private projectService: ProjectsService, private fb: FormBuilder, 
    private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        this.user = user
      });
     }

  ngOnInit(): void {
    this.loadProjects();
    this.initializeForm();
  }

  loadProjects() {
    this.projectService.getProjectsByManager(this.user.id).subscribe(response => {
      this.projects = response;
      response.forEach(project => {
        this.memberCount++;
        this.totalCost += project.budget;
      })
    });
  }

  getProjectDetails(project: Project) {
    this.selectedProject = project;
  }

  initializeForm() {
    this.addProjectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      clientName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
      budget: ['', Validators.required],
      expenditure: ['0', this.spendLess('budget')],
      startDate: ['', Validators.required],
      endDate: ['', Validators.compose([Validators.required, this.dateGreater('startDate')])],
      teamSize: ['', Validators.required],
      managerId: ['', Validators.required],
      isActive: [true],
    });
    this.addProjectForm.controls.startDate.valueChanges.subscribe(() => {
      this.addProjectForm.controls.endDate.updateValueAndValidity();
    })
    this.addProjectForm.controls.budget.valueChanges.subscribe(() => {
      this.addProjectForm.controls.expenditure.updateValueAndValidity();
    })
  }

  dateGreater(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value > control?.parent?.controls[matchTo].value ? null : { isGreater: true};
    }
  }

  spendLess(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value <= control?.parent?.controls[matchTo].value ? null : { spendLessThanBudget: true};
    }
  }
  
  submit() {
    let values = this.addProjectForm.value;
    var newObj: any = {
      projectName: values.projectName,
      clientName: values.clientName,
      budget: values.budget,
      expenditure: values.expenditure,
      startDate: values.startDate,
      endDate: values.endDate,
      teamSize: values.teamSize,
      managerId: values.managerId,
      isActive: values.isActive,
      projectDescription: '',
    }
    
    this.projects.push(newObj)
    this.projectService.addProject(newObj).subscribe({
      next: () => this.addProjectForm.reset(),
      error: e => this.validationErrors = e
    })
    // console.log(newObj);
    // this.addProjectForm.reset();
  }

  closeAddProject() {
    this.addProjectForm.reset();
    this.initializeForm();
  }

}
