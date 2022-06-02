using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProjectsController : BaseApiController
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
    
        public ProjectsController(IProjectRepository projectRepository, IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _projectRepository = projectRepository;
          
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects() {
            var projects = await _projectRepository.GetProjectsAsync();

            var projectsToReturn = _mapper.Map<IEnumerable<ProjectDto>>(projects);

            return Ok(projectsToReturn);
        }

        // not working
        [HttpGet("manager/{id}")]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjectsByManager(int id) {
            var projects = await _projectRepository.GetProjectsByManagerAsync(id);

            if (projects == null) return Ok();

            var projectsToReturn = _mapper.Map<IEnumerable<ProjectDto>>(projects);

            return Ok(projectsToReturn);
        }

        [HttpGet("{projectname}")]
        public async Task<ActionResult<Project>> GetProject(string projectname) {
            var project = await _projectRepository.GetProjectByProjectNameAsync(projectname);

            if (project == null) return BadRequest("Project not found");
            
            var projectToReturn = _mapper.Map<ProjectDto>(project);

            return Ok(projectToReturn);
        }

        [HttpPost("addproject")]
        public async Task<ActionResult> AddProject(ProjectDto projectDto) {
            if (await _projectRepository.ProjectExists(projectDto.ProjectName)) return BadRequest("Projectname already exists");

            var project = _mapper.Map<Project>(projectDto);

            _projectRepository.AddProject(project);
            await _projectRepository.SaveAllAsync();

            return Created(projectDto.ProjectName, projectDto);
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateProject(int id, ProjectUpdateDto projectDto) {
            var project = await _projectRepository.GetProjectByIdAsync(id);

            if (project == null) return NotFound();

            var projectToMap = _mapper.Map(projectDto, project);
            var projectToReturn = _mapper.Map<ProjectUpdatedDto>(projectToMap);
            _projectRepository.Update(project);
            
            if (await _projectRepository.SaveAllAsync()) return Ok(projectToReturn);

            return BadRequest("Project failed to update");
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> RemoveProject(int id) {
            var project = await _projectRepository.GetProjectByIdAsync(id);
            
            if (project == null) return NotFound();

            _projectRepository.RemoveProject(project);

            if(await _projectRepository.SaveAllAsync()) return Ok(
                new ResponseDto{ Status = 200, Message = "Project deleted"}
                );

            return BadRequest("Failed to delete the project");
        }

        [HttpPut("addmember")]
        public async Task<ActionResult> AddMember(ProjectMemberDto projectMemberDto) {
            var user = await _userRepository.GetUserByUsernameAsync(projectMemberDto.Username);

            if (user == null) return BadRequest("User not found");

            var project = await _projectRepository.GetProjectByIdAsync(projectMemberDto.ProjectId);

            if (project == null) return BadRequest("Project not found");
            
            if (project.Members.FirstOrDefault(x => x.Id == user.Id) != null) return BadRequest("User already exists");
            
            project.Members.Add(user);

            if(await _projectRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to add member");
        }

        [HttpPut("removemember")]
        public async Task<ActionResult> RemoveMember(ProjectMemberDto projectMemberDto) {
            var user = await _userRepository.GetUserByUsernameAsync(projectMemberDto.Username);

            if (user == null) return BadRequest("User not found");
            
            var project = await _projectRepository.GetProjectByIdAsync(projectMemberDto.ProjectId);

            if (project == null) return BadRequest("Project not found");

            project.Members.Remove(user);

            if (await _projectRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to remove member");
        }

    }
}