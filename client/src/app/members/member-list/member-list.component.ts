import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  member: Member;
  isAdmin: boolean;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 10;
  user: User;
  
  updateMemberForm: FormGroup;
  validationErrors: string[] = [];


  constructor(private memberService: MembersService, private fb: FormBuilder,
    private toastr: ToastrService, private accountService: AccountService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(response => {
        this.user = response;
        // return response;
      })
    }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers();
    this.loadMembers();
    this.initializeForm();
  }

  loadMembers() {
    this.memberService.getMembers(this.user.username, this.pageNumber, this.pageSize).subscribe(response => {
      // console.log('memberlist');
      this.members = response.result;
      // this.members = response.result.filter(x => (x.id != this.user.id) );
      // console.log(this.members);
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMembers();
  }

  initializeForm() {
    this.updateMemberForm = this.fb.group ({
      username: [{value: '', disabled: true}],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['male'],
      // projectRole: [''],
    })
  }

  patchValues(user: Member) {
    // console.log(user);
    this.updateMemberForm.patchValue({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      dateOfBirth: new Date(user.dateOfBirth),
      city: user.city,
      country: user.country,
      gender: user.gender
    })
    this.member = user;
  }

  updateMember() {
    let values = this.updateMemberForm.value;
    var newObj: any = {
      firstName: values.firstName,
      lastName: values.lastName,
      mobile: values.mobile,
      email: values.email,
      dateOfBirth: values.dateOfBirth,
      city: values.city,
      country: values.country,
      gender: values.gender
    }
    this.memberService.updateMember(this.member.username, newObj).subscribe({
      next: (response: Member) => {
        const index = this.members.indexOf(this.member);
        this.members[index] = response;
        this.updateMemberForm.reset();
        this.toastr.success("Member updated");
      },
      error: e => this.validationErrors = e
    })
  }

  deleteMember(username: string) {
    this.memberService.deleteUser(username).subscribe(() => {
      this.members = this.members.filter(x => x.username != username);
      this.toastr.success("Member deleted");
      this.loadMembers();
    })
  }

  closeUpdateMember() {
    this.updateMemberForm.reset();
    this.initializeForm();
  }
}
