import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @Input() username: string;
  member: Member;

  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    var username = "";
    if (this.route.snapshot.paramMap.get('username') == null) {
      username = this.username;
    } else {
      username = this.route.snapshot.paramMap.get('username');
    }
    this.memberService.getMember(username).subscribe(member => {
      this.member = member;
    })
  }

}
