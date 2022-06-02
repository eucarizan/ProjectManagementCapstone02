using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IProjectRepository
    {
        void Update(Project project);
        Task<bool> SaveAllAsync();
        Task<IEnumerable<Project>> GetProjectsAsync();
        Task<IEnumerable<Project>> GetProjectsByManagerAsync(int id);
        Task<Project> GetProjectByIdAsync(int id);
        Task<Project> GetProjectByProjectNameAsync(string projectName);
        Task<bool> ProjectExists(string projectname);
        void AddProject(Project project);
        void RemoveProject(Project project);
    }
}