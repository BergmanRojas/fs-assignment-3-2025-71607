using Application.Features.Auth.Rules;
using Application.Services.AuthService;
using Application.Services.Doctors;
using Application.Services.Encryptions;
using Domain.Entities;
using MediatR;
using NArchitecture.Core.Security.Hashing;
using NArchitecture.Core.Security.JWT;

namespace Application.Features.Auth.Commands.Register.DoctorRegister;

public class DoctorRegisterCommand : IRequest<DoctorRegisteredResponse>
{
    public DoctorForRegisterDto DoctorForRegisterDto { get; set; }
    public string IpAddress { get; set; }

    public DoctorRegisterCommand()
    {
        DoctorForRegisterDto = null!;
        IpAddress = string.Empty;
    }

    public DoctorRegisterCommand(DoctorForRegisterDto doctorForRegisterDto, string ipAddress)
    {
        DoctorForRegisterDto = doctorForRegisterDto;
        IpAddress = ipAddress;
    }

    public class DoctorRegisterCommandHandler : IRequestHandler<DoctorRegisterCommand, DoctorRegisteredResponse>
    {
        private readonly IDoctorService _doctorService;
        private readonly IAuthService _authService;
        private readonly AuthBusinessRules _authBusinessRules;

        public DoctorRegisterCommandHandler(
            IDoctorService doctorService,
            IAuthService authService,
            AuthBusinessRules authBusinessRules
        )
        {
            _doctorService = doctorService;
            _authService = authService;
            _authBusinessRules = authBusinessRules;
        }

        public async Task<DoctorRegisteredResponse> Handle(DoctorRegisterCommand request, CancellationToken cancellationToken)
        {
            // Basic identity validation
            _authBusinessRules.ValidateNationalIdentityAndBirthYearWithMernis(
                request.DoctorForRegisterDto.NationalIdentity,
                request.DoctorForRegisterDto.FirstName,
                request.DoctorForRegisterDto.LastName,
                request.DoctorForRegisterDto.DateOfBirth.Year);

            await _authBusinessRules.UserEmailShouldBeNotExists(request.DoctorForRegisterDto.Email);

            HashingHelper.CreatePasswordHash(
                request.DoctorForRegisterDto.Password,
                out byte[] passwordHash,
                out byte[] passwordSalt);

            Doctor newDoctor = new()
            {
                FirstName = request.DoctorForRegisterDto.FirstName,
                LastName = request.DoctorForRegisterDto.LastName,
                Phone = request.DoctorForRegisterDto.Phone,
                Email = request.DoctorForRegisterDto.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Title = request.DoctorForRegisterDto.Title,
                SchoolName = request.DoctorForRegisterDto.SchoolName,
                DateOfBirth = request.DoctorForRegisterDto.DateOfBirth,
                NationalIdentity = request.DoctorForRegisterDto.NationalIdentity,
                Address = request.DoctorForRegisterDto.Address
            };

            newDoctor.FirstName = CryptoHelper.Encrypt(newDoctor.FirstName);
            newDoctor.LastName = CryptoHelper.Encrypt(newDoctor.LastName);
            newDoctor.NationalIdentity = CryptoHelper.Encrypt(newDoctor.NationalIdentity);
            newDoctor.Phone = CryptoHelper.Encrypt(newDoctor.Phone);
            newDoctor.Address = CryptoHelper.Encrypt(newDoctor.Address);
            newDoctor.Email = CryptoHelper.Encrypt(newDoctor.Email);

            Doctor createdDoctor = await _doctorService.AddAsync(newDoctor);

            AccessToken createdAccessToken = await _authService.CreateAccessToken(createdDoctor);

            Domain.Entities.RefreshToken createdRefreshToken = await _authService.CreateRefreshToken(
                createdDoctor,
                request.IpAddress);

            Domain.Entities.RefreshToken addedRefreshToken = await _authService.AddRefreshToken(createdRefreshToken);

            DoctorRegisteredResponse registeredResponse = new()
            {
                AccessToken = createdAccessToken,
                RefreshToken = addedRefreshToken
            };

            return registeredResponse;
        }
    }
}
