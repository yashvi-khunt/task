﻿using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProductCatalogue.Models;
using ProductCatalogue.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProductCatalogue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuth authRepository;

        public AuthController(IAuth authRepository )
        {
            this.authRepository = authRepository;
        }

        [HttpPost]
        [Route("/api/login")]
        public IActionResult Login(User user)
        {
            // Validate user input
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tokenString = authRepository.Login(user);
            if (tokenString == null)
            {
                return NotFound("User Not Found or Invalid Credentials");
            }
            return Ok(new { Token = tokenString });
        }
        [HttpPost]
        [Route("/api/register")]
        public IActionResult Register(User user)
        {
            var result = authRepository.SignUp(user);
            if (!result)
            {
                return Conflict("User with same userName already exists.");
            }
            return Ok();
        }

    }
}
