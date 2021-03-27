using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> CreateActivity(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command {TargetUsername = username}));
        }
    }
}