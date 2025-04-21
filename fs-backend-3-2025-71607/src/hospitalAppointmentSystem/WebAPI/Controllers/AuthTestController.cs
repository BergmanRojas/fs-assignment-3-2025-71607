
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthTestController : ControllerBase
    {
        [Authorize]
        [HttpGet("secure")]
        public IActionResult GetSecure()
        {
            return Ok("✅ Access granted: You are authenticated with Azure AD B2C.");
        }

        [AllowAnonymous]
        [HttpGet("public")]
        public IActionResult GetPublic()
        {
            return Ok("🌐 Public endpoint: No authentication needed.");
        }
    }
}