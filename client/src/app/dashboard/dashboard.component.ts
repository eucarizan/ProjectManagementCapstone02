import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { Member } from '../_models/member';
import { Project } from '../_models/projects';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/members.service';
import { ProjectsService } from '../_services/projects.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project;

  eastMember: Member;

  user: User;
  member: Member;

  memberCount: number = 0;
  totalCost: number = 0;
  taskCount: number = 0;
  clients: string[] = [];

  eastMembers: Member[] = [];
  eastUnavailable: number = 0;
  southMembers: Member[] = [];
  southUnavailable: number = 0;
  northMembers: Member[] = [];
  northUnavailable: number = 0;
  westMembers: Member[] = [];
  westUnavailable: number = 0;

  addProjectForm: FormGroup;
  validationErrors: string[] = [];

  constructor(private projectService: ProjectsService, private accountService: AccountService, 
    private memberService: MembersService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.getMember();
      this.loadProjects();
      this.initializeForm();
    })
  }

  loadProjects() {
    this.projectService.getProjectsByManager(this.user.id).subscribe(response => {
      this.projects = response;
      // console.log('loadProjects ', response);
      response.forEach(project => {
        if (project.members) {
          this.memberCount += project.members.length;
        }
        this.totalCost += project.budget;
        this.clients.push(project.clientName);
      })
    });
  }

  getMember() {
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member = member;
    })
  }

  getProjectDetails(project: Project) {
    // this.selectedProject = project;
    // this.memberCount = project.members.length;
    this.eastMembers = [];
    this.southMembers = [];
    this.northMembers = [];
    this.westMembers = [];

    this.eastUnavailable = 0;
    this.westUnavailable = 0;
    this.southUnavailable = 0;
    this.northUnavailable = 0;

    this.projectService.getProject(project.projectName).subscribe(project => {
      this.selectedProject = project;
      // this.memberCount = project.members.length;
      project.members.forEach(member => {
        switch (member.region.toLowerCase()) {
          case "east":
            this.eastMembers.push(member);
            if (member.status.toLowerCase() != "available") {
              this.eastUnavailable++;
            }
            break;
          case "west":
            this.westMembers.push(member);
            if (member.status.toLowerCase() != "available") {
              this.westUnavailable++;
            }
            break;
          case "north":
            this.northMembers.push(member);
            if (member.status.toLowerCase() != "available") {
              this.northUnavailable++;
            }
            break;
          case "south":
            this.southMembers.push(member);
            if (member.status.toLowerCase() != "available") {
              this.southUnavailable++;
            }
            break;
          default:
            break;
        }
      });
      this.eastMember = this.eastMembers[0];
      console.log('eastmember ',this.eastMember);
    });
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
  }

  closeAddProject() {
    this.addProjectForm.reset();
    this.initializeForm();
  }

}
