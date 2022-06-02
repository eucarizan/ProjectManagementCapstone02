using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Project, ProjectDto>().ReverseMap();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Project, ProjectMemberDto>();
            CreateMap<MemberToAddDto, AppUser>();
            CreateMap<AppUser, ProjectMembersDto>();
            CreateMap<Project, MemberProjectsDto>();
            CreateMap<ProjectUpdateDto, Project>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<Project, ProjectUpdatedDto>();
        }
    }
}