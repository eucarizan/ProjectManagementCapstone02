import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Member } from '../_models/member';
import { Project } from '../_models/projects';
import { MembersService } from '../_services/members.service';
import { ProjectsService } from '../_services/projects.service';

import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: Project[];
  project: Project;
  members: Member[];
  user: User;

  updateProjectForm: FormGroup;
  validationErrors: string[] = [];

  addMemberForm: FormGroup;
  selectedMember: Member;
  tempMembers: Member[];
  memberSelected: boolean = false;
  modalRef: BsModalRef;

  constructor(private projectService: ProjectsService, private fb: FormBuilder, private memberService: MembersService,
    private toastr: ToastrService, private modalService: BsModalService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      // console.log(this.user);
      this.loadProjects();
      this.initializeForm();
    });
  }

  loadProjects() {
    // this.projectService.getProjects(this.user.id).subscribe(response => {
    //   this.projects = response;
    // })
    if (this.user.roles.includes('Admin')) {
      this.projectService.getProjects().subscribe(response => {
        this.projects = response;
      })
    } else {
      this.projectService.getProjectsByManager(this.user.id).subscribe(response => {
        this.projects = response;
      })
    }
    this.memberService.getMemberList().subscribe(response => {
      this.members = response;
      // console.log(response);
    })
    this.memberSelected = false;
  }

  deleteProject(id: number) {
    // alert('delete');
    this.projectService.deleteProject(id).subscribe(() => {
      this.toastr.success("Project deleted");
      this.projects = this.projects.filter(x => x.id != id);
    });
  }

  initializeForm() {
    this.updateProjectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      clientName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
      budget: ['', Validators.required],
      expenditure: ['0', this.spendLess('budget')],
      startDate: ['', Validators.required],
      endDate: ['', Validators.compose([Validators.required, this.dateGreater('startDate')])],
      teamSize: ['', Validators.required],
      managerId: ['', Validators.required],
      projectDescription: ['', Validators.required],
      isActive: [true],
    });
    this.updateProjectForm.controls.startDate.valueChanges.subscribe(() => {
      this.updateProjectForm.controls.endDate.updateValueAndValidity();
    })
    this.updateProjectForm.controls.budget.valueChanges.subscribe(() => {
      this.updateProjectForm.controls.expenditure.updateValueAndValidity();
    })

    this.addMemberForm = this.fb.group({
      members: [''],

    })
  }

  dateGreater(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value > control?.parent?.controls[matchTo].value ? null : { isGreater: true };
    }
  }

  spendLess(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value <= control?.parent?.controls[matchTo].value ? null : { spendLessThanBudget: true };
    }
  }

  submit() {
    let values = this.updateProjectForm.value;
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
      projectDescription: values.projectDescription,
    }

    // console.log(this.project.id)
    // this.projects.push(newObj)
    this.projectService.updateProject(this.project.id, newObj).subscribe({
      next: (response: Project) => {
        const index = this.projects.indexOf(this.project);
        // console.log(response);
        this.projects[index] = response;
        this.updateProjectForm.reset();
        this.toastr.success('Project updated');
      },
      error: e => this.validationErrors = e
    })
    // console.log(newObj);
    // this.updateProjectForm.reset();
  }

  closeUpdateProject() {
    this.updateProjectForm.reset();
    this.initializeForm();
  }

  patchValues(project: Project) {
    // console.log(project);
    this.updateProjectForm.patchValue({
      projectName: project.projectName,
      clientName: project.clientName,
      budget: project.budget,
      expenditure: project.expenditure,
      startDate: new Date(project.startDate),
      endDate: new Date(project.endDate),
      teamSize: project.teamSize,
      managerId: project.managerId,
      isActive: project.isActive,
      projectDescription: project.projectDescription
    })
    this.project = project;
  }

  closeAddMember() {
    this.addMemberForm.reset();
    this.initializeForm();
  }

  selectMember(member: Member) {
    this.selectedMember = member;
    this.memberSelected = true;
  }

  addProjectMember(project: Project) {
    this.project = project;
    // console.log("string")
    this.tempMembers = []
    this.members.forEach(member => {
      if (member.projects.length == 0) {
        this.tempMembers.push(member);
      } else {
        var filteredMembers = member.projects.filter(e => e.id == project.id);
        if (filteredMembers.length == 0) {
          this.tempMembers.push(member);
        }
      }
    })
    this.loadProjects();
  }

  openModal() {

  }

  addMember() {
    var newObj: any = {
      projectid: this.project.id,
      username: this.selectedMember.username
    }

    // console.log(newObj)
    this.projectService.addMemberToProject(newObj, this.project).subscribe({
      next: () => {
        this.selectedMember = null;
        this.toastr.success('Member added to project');
        this.loadProjects();
      },
      error: e => {
        this.validationErrors = e;
        this.selectedMember = null;
      }
    })
  }
}
