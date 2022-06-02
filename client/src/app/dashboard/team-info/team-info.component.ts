import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Project } from 'src/app/_models/projects';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { ProjectsService } from 'src/app/_services/projects.service';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {
  // @Input() teamInfo: any;
  teamInfo: Project[] = [];
  memberCount: number = 0;
  totalCost: number = 0;
  taskCount: number = 0;
  clients: string[] = [];
  user: User;
  member: Member;

  constructor(private projectService: ProjectsService, private accountService: AccountService, 
    private memberService: MembersService) { }

  ngOnInit(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.loadProjects();
      this.getMember();
    });
  }

  loadProjects() {
    this.projectService.getProjectsByManager(this.user.id).subscribe(response => {
      this.teamInfo = response;
      // console.log("team-info");
      response.forEach(project => {
        if (project.members) {
          this.memberCount+=project.members.length;
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

}
