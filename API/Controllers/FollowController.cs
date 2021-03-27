using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command {TargetUsername = username}));
        }

        
        /*
        This api get followers or followings based in predicate "followers" or "following"
        username is route parameter
        predicate is query string
        */      
        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollowings(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new List.Query
            {
                Username = username,
                Predicate = predicate
            }));
        }
    }
}