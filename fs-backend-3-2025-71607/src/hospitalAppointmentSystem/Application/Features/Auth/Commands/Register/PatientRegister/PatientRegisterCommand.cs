using Application.Features.Auth.Rules;
using Application.Services.AuthService;
using Application.Services.Encryptions;
using Application.Services.Patients;
using Application.Services.UsersService;
using Domain.Entities;
using MediatR;
using NArchitecture.Core.Security.Hashing;
using NArchitecture.Core.Security.JWT;

namespace Application.Features.Auth.Commands.Register.PatientRegister
{
    public class PatientRegisterCommand : IRequest<PatientRegisteredResponse>
    {
        public PatientForRegisterDto PatientForRegisterDto { get; set; }
        public string IpAddress { get; set; }

        public PatientRegisterCommand()
        {
            PatientForRegisterDto = null!;
            IpAddress = string.Empty;
        }

        public PatientRegisterCommand(PatientForRegisterDto patientForRegisterDto, string ipAddress)
        {
            PatientForRegisterDto = patientForRegisterDto;
            IpAddress = ipAddress;
        }

        public class PatientRegisterCommandHandler : IRequestHandler<PatientRegisterCommand, PatientRegisteredResponse>
        {
            private readonly IPatientService _patientService;
            private readonly IUserService _userService;
            private readonly IAuthService _authService;
            private readonly AuthBusinessRules _authBusinessRules;
            private readonly IMediator _mediator;

            public PatientRegisterCommandHandler(
                IPatientService patientService,
                IUserService userService,
                IAuthService authService,
                AuthBusinessRules authBusinessRules,
                IMediator mediator
            )
            {
                _patientService = patientService;
                _userService = userService;
                _authService = authService;
                _authBusinessRules = authBusinessRules;
                _mediator = mediator;
            }

            public async Task<PatientRegisteredResponse> Handle(PatientRegisterCommand request, CancellationToken cancellationToken)
            {
                HashingHelper.CreatePasswordHash(
                    request.PatientForRegisterDto.Password,
                    out byte[] passwordHash,
                    out byte[] passwordSalt
                );

                Patient newPatient =
                    new()
                    {
                        FirstName = request.PatientForRegisterDto.FirstName,
                        LastName = request.PatientForRegisterDto.LastName,
                        Phone = request.PatientForRegisterDto.Phone,
                        Email = request.PatientForRegisterDto.Email,
                        PasswordHash = passwordHash,
                        PasswordSalt = passwordSalt,
                    };

                // Şifreleme işlemleri
                newPatient.FirstName = CryptoHelper.Encrypt(newPatient.FirstName);
                newPatient.LastName = CryptoHelper.Encrypt(newPatient.LastName);
                newPatient.Phone = CryptoHelper.Encrypt(newPatient.Phone);
                newPatient.Email = CryptoHelper.Encrypt(newPatient.Email);

                await _authBusinessRules.UserEmailShouldNotBeExpiredAuthenticator(newPatient.Email);

                // E-posta adresine göre kullanıcı sorgusu
                var existingUser = await _userService.GetAsync(
                    predicate: u => u.Email == newPatient.Email
                );

                User createdUser;

                if (existingUser != null)
                {
                    // Eğer kullanıcı varsa, güncelleme işlemi yapabilirsiniz
                    existingUser.FirstName = newPatient.FirstName;
                    existingUser.LastName = newPatient.LastName;
                    existingUser.Phone = newPatient.Phone;
                    existingUser.DeletedDate = null;
                    existingUser.AuthenticatorType = 0;

                    createdUser = await _userService.UpdateAsync(existingUser);

                    AccessToken createdAccessToken = await _authService.CreateAccessToken(createdUser);

                    Domain.Entities.RefreshToken createdRefreshToken = await _authService.CreateRefreshToken(
                        createdUser,
                        request.IpAddress
                    );

                    Domain.Entities.RefreshToken addedRefreshToken = await _authService.AddRefreshToken(createdRefreshToken);

                    
                    PatientRegisteredResponse registeredResponse =
                       new() { AccessToken = createdAccessToken, RefreshToken = addedRefreshToken };
                    return registeredResponse;
                }
                else
                {
                    
                    Patient createdPatient = await _patientService.AddAsync(newPatient);
                    
                    AccessToken createdAccessToken = await _authService.CreateAccessToken(createdPatient);

                    Domain.Entities.RefreshToken createdRefreshToken = await _authService.CreateRefreshToken(
                        createdPatient,
                        request.IpAddress
                    );

                    Domain.Entities.RefreshToken addedRefreshToken = await _authService.AddRefreshToken(createdRefreshToken);

                    

                    PatientRegisteredResponse registeredResponse =
                        new() { AccessToken = createdAccessToken, RefreshToken = addedRefreshToken };
                    return registeredResponse;
                }

               
            }
        }
    }
}
