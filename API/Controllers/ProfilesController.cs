using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;
using Details = Application.Profiles.Details;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query
            { Username = username, Predicate = predicate }));
        }
    }
}