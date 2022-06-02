using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        // [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams) {
            // var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            // userParams.CurrentUserName = user.UserName;

            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }

        [HttpGet("list")]
        public async Task<IEnumerable<MemberDto>> GetUserList() {
            var users = await _userRepository.GetUsersAsync();
            var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            return usersToReturn;
        }

        // [Authorize(Roles = "Member")]
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username) {
            var user = await _userRepository.GetMemberAsync(username);

            if (user == null) return NotFound();
            
            return user;
        }

        // [HttpGet("nj")]
        // public async Task<ActionResult<IEnumerable<MemberDto>>> GetNjUsers() {
        //     return Ok(await _userRepository.GetUseProj());
        // }
        

        [HttpPut("update/{username}")]
        public async Task<ActionResult> UpdateUser(string username, MemberUpdateDto memberDto) {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            _mapper.Map(memberDto, user);
            _userRepository.Update(user);

            var userToReturn = _mapper.Map<MemberDto>(user);

            if (await _userRepository.SaveAllAsync()) return Ok(userToReturn);

            return BadRequest("User failed to update");
        }

        [HttpDelete("delete/{username}")]
        public async Task<ActionResult> DeleteUser(string username) {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            _userRepository.DeleteUser(user);

            if (await _userRepository.SaveAllAsync()) return Ok(
                new ResponseDto{
                    Status = 200,
                    Message = "User deleted"
                }
            );

            return BadRequest("Faield to delete the user");
        }

        [HttpPost("add")]
        public async Task<ActionResult<MemberDto>> AddUser(MemberDto memberDto){
            if (await _userRepository.UserExistsAsync(memberDto.Username)) return BadRequest("Username is taken");

            var user = _mapper.Map<AppUser>(memberDto);

            _userRepository.AddUser(user);
            if (await _userRepository.SaveAllAsync()) return Created(user.UserName, user);

            return BadRequest("User failed to add");
        }

    }
}