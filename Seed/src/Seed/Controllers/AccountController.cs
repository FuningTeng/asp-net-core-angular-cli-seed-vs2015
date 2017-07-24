using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Seed.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Principal;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Seed.Auth;
using System.Threading;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Seed.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private UserManager<IdentityUser> userManager;
        private SignInManager<IdentityUser> signInManager;

        public AccountController(UserManager<IdentityUser> userMgr, SignInManager<IdentityUser> signInMgr)
        {
            userManager = userMgr;
            signInManager = signInMgr;
        }
        // GET: api/values
        [HttpGet]
        [Authorize("Bearer")]
        public async Task<IActionResult> Get(CancellationToken token)
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            var id = claimsIdentity.Claims
                .FirstOrDefault(r => r.Type == JwtRegisteredClaimNames.Jti)?.Value;
            IdentityUser user = await userManager.FindByIdAsync(id);
            return Ok(
                new
                {
                    id = user.Id,
                    userName = user.UserName
                }
            );
        }

        // POST api/account
        [HttpPost]
        public async Task<IActionResult> GetAuthToken([FromBody]LoginModel loginModel)
        {
            if (ModelState.IsValid)
            {
                IdentityUser user = await userManager.FindByNameAsync(loginModel.Name);
                if (user != null)
                {
                    await signInManager.SignOutAsync();
                    if ((await signInManager.PasswordSignInAsync(user, loginModel.Password, false, false)).Succeeded)
                    {
                        var requestAt = DateTime.Now;
                        var expiresIn = requestAt + TokenAuthOption.ExpiresSpan;
                        var token = GenerateToken(user, expiresIn);
                        return Ok(new
                        {
                            request_at = requestAt,
                            expires_in = TokenAuthOption.ExpiresSpan.TotalSeconds,
                            tokey_type = TokenAuthOption.TokenType,
                            token = token,
                            username = loginModel.Name,
                            userid = user.Id
                        });
                    }
                    else
                    {
                        return Forbid("Not valid user");
                    }
                }

            }
            return BadRequest("Not valid user");
        }

        private string GenerateToken(IdentityUser user, DateTime expires)
        {
            var now = DateTime.UtcNow;
            DateTimeOffset now2 = now;

            // Specifically add the jti (nonce), iat (issued timestamp), and sub (subject/user) claims.
            // You can add other claims here, if you want:
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, user.Id),
                new Claim(JwtRegisteredClaimNames.Iat,  now2.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            // Create the JWT and write it to a string
            var jwt = new JwtSecurityToken(
                issuer: TokenAuthOption.Issuer,
                audience: TokenAuthOption.Audience,
                claims: claims,
                notBefore: now,
                expires: now.Add(TokenAuthOption.ExpiresSpan),
                signingCredentials: TokenAuthOption.SigningCredentials);
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }
    }
}
