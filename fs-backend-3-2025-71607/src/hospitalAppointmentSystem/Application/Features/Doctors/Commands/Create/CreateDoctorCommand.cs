using Application.Features.Doctors.Rules;
using Application.Services.Encryptions;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Pipelines.Logging;
using NArchitecture.Core.Application.Pipelines.Transaction;
using NArchitecture.Core.Security.Hashing;

namespace Application.Features.Doctors.Commands.Create;

/// <summary>Creates a new doctor and encrypts all sensitive data.</summary>
public sealed class CreateDoctorCommand : IRequest<CreatedDoctorResponse>,
                                          ICachableRequest,
                                          ILoggableRequest,
                                          ITransactionalRequest
{
    // ── Professional data ───────────────────────────────────────────────
    public required string Title      { get; init; }
    public required string SchoolName { get; init; }

    // ── Personal data ───────────────────────────────────────────────────
    public required string FirstName        { get; init; }
    public required string LastName         { get; init; }
    public required DateOnly DateOfBirth    { get; init; }
    public required string NationalIdentity { get; init; }
    public required string Phone            { get; init; }
    public required string Address          { get; init; }

    // ── Credentials ────────────────────────────────────────────────────
    public required string Email    { get; init; }
    public required string Password { get; init; }

    // ── ICachableRequest implementation ────────────────────────────────
    public bool    BypassCache   => false;
    public string? CacheKey      => $"Doctor-{Email}";
    public string? CacheGroupKey => "GetDoctors";
    public TimeSpan? SlidingExpiration { get; } = TimeSpan.FromMinutes(30);

    // ── Handler ────────────────────────────────────────────────────────
    public sealed class Handler : IRequestHandler<CreateDoctorCommand, CreatedDoctorResponse>
    {
        private readonly IMapper             _mapper;
        private readonly IDoctorRepository   _doctorRepository;
        private readonly DoctorBusinessRules _rules;

        public Handler(IMapper mapper,
                       IDoctorRepository doctorRepository,
                       DoctorBusinessRules rules)
        {
            _mapper           = mapper;
            _doctorRepository = doctorRepository;
            _rules            = rules;
        }

        public async Task<CreatedDoctorResponse> Handle(CreateDoctorCommand request,
                                                        CancellationToken    ct)
        {
            // 1️⃣  Business rule → unique national‑identity
            await _rules.DoctorNationalIdentityMustBeUnique(request.NationalIdentity, ct);

            // 2️⃣  Map & hash password
            Doctor doctor = _mapper.Map<Doctor>(request);

            HashingHelper.CreatePasswordHash(
                request.Password,
                out byte[] hash,
                out byte[] salt);

            doctor.PasswordHash = hash;
            doctor.PasswordSalt = salt;

            // 3️⃣  Encrypt sensitive fields *before* persisting
            doctor.FirstName        = CryptoHelper.Encrypt(doctor.FirstName);
            doctor.LastName         = CryptoHelper.Encrypt(doctor.LastName);
            doctor.NationalIdentity = CryptoHelper.Encrypt(doctor.NationalIdentity);
            doctor.Phone            = CryptoHelper.Encrypt(doctor.Phone);
            doctor.Address          = CryptoHelper.Encrypt(doctor.Address);
            doctor.Email            = CryptoHelper.Encrypt(doctor.Email);

            await _doctorRepository.AddAsync(doctor, ct);

            return _mapper.Map<CreatedDoctorResponse>(doctor);
        }
    }
}
