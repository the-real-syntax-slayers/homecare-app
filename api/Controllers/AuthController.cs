using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using HealthApp.DTOs;
using HealthApp.Models;
using HealthApp.DAL;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

namespace HealthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AuthUser> _userManager;
        private readonly SignInManager<AuthUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
        private readonly BookingDbContext _bookingDbContext;

        public AuthController(
            UserManager<AuthUser> userManager,
            SignInManager<AuthUser> signInManager,
            IConfiguration configuration,
            ILogger<AuthController> logger,
            BookingDbContext bookingDbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _logger = logger;
            _bookingDbContext = bookingDbContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new AuthUser
            {
                UserName = dto.Username,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                _logger.LogWarning("[AuthController] Registration failed for {User}", dto.Username);
                return BadRequest(result.Errors);
            }

            // Determine role based on username (same logic as frontend)
            string usernameLower = dto.Username.ToLower();
            bool isEmployee = usernameLower.StartsWith("emp");
            bool isAdmin = usernameLower == "admin";

            // Extract ID from username (e.g., "Adrian77" -> 77, "emp5" -> 5)
            var match = Regex.Match(dto.Username, @"(\d+)$");
            
            if (match.Success && int.TryParse(match.Value, out int extractedId))
            {
                try
                {
                    if (isEmployee)
                    {
                        // Create or update Employee
                        var existingEmployee = await _bookingDbContext.Employees.FindAsync(extractedId);
                        
                        if (existingEmployee == null)
                        {
                            var employee = new Employee
                            {
                                EmployeeId = extractedId,
                                Name = dto.Username,
                                Description = $"Employee created from registration: {dto.Email}"
                            };
                            
                            _bookingDbContext.Employees.Add(employee);
                            await _bookingDbContext.SaveChangesAsync();
                            _logger.LogInformation("[AuthController] Created Employee {EmployeeId} for user {User}", extractedId, dto.Username);
                        }
                        else
                        {
                            // Employee already exists, update the name if needed
                            if (existingEmployee.Name != dto.Username)
                            {
                                existingEmployee.Name = dto.Username;
                                await _bookingDbContext.SaveChangesAsync();
                            }
                            _logger.LogInformation("[AuthController] Employee {EmployeeId} already exists for user {User}", extractedId, dto.Username);
                        }
                    }
                    else if (!isAdmin)
                    {
                        // Create or update Patient (default for non-admin, non-employee usernames)
                        var existingPatient = await _bookingDbContext.Patients.FindAsync(extractedId);
                        
                        if (existingPatient == null)
                        {
                            var patient = new Patient
                            {
                                PatientId = extractedId,
                                Name = dto.Username,
                                Description = $"Patient created from registration: {dto.Email}"
                            };
                            
                            _bookingDbContext.Patients.Add(patient);
                            await _bookingDbContext.SaveChangesAsync();
                            _logger.LogInformation("[AuthController] Created Patient {PatientId} for user {User}", extractedId, dto.Username);
                        }
                        else
                        {
                            // Patient already exists, update the name if needed
                            if (existingPatient.Name != dto.Username)
                            {
                                existingPatient.Name = dto.Username;
                                await _bookingDbContext.SaveChangesAsync();
                            }
                            _logger.LogInformation("[AuthController] Patient {PatientId} already exists for user {User}", extractedId, dto.Username);
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log the error but don't fail registration
                    _logger.LogError(ex, "[AuthController] Failed to create Patient/Employee for user {User}", dto.Username);
                    // Continue with registration even if patient/employee creation fails
                }
            }
            else
            {
                _logger.LogWarning("[AuthController] Could not extract ID from username {User}. Patient/Employee not created.", dto.Username);
            }

            _logger.LogInformation("[AuthController] User registered: {User}", dto.Username);
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.Username);

            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                _logger.LogWarning("[AuthController] Login failed for {User}", dto.Username);
                return Unauthorized("Invalid username or password");
            }

            var token = GenerateJwtToken(user);

            _logger.LogInformation("[AuthController] User logged in: {User}", dto.Username);

            return Ok(new { token });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("[AuthController] Logout performed");
            return Ok(new { message = "Logout successful" });
        }

        private string GenerateJwtToken(AuthUser user)
        {
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT key missing");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
