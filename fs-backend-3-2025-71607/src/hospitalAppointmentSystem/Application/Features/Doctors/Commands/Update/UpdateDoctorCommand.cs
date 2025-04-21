using Application.Features.Doctors.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Pipelines.Logging;
using NArchitecture.Core.Application.Pipelines.Transaction;
using MediatR;
using Application.Services.Encryptions;

namespace Application.Features.Doctors.Commands.Update;

public class UpdateDoctorCommand : IRequest<UpdatedDoctorResponse>, ILoggableRequest, ITransactionalRequest
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string SchoolName { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string NationalIdentity { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string[] Roles => new[] { "Admin", "Write", "Update" };
    public bool BypassCache => false;
    public string? CacheKey => null;
    public string[]? CacheGroupKey => new[] { "GetDoctors" };

    public class UpdateDoctorCommandHandler : IRequestHandler<UpdateDoctorCommand, UpdatedDoctorResponse>
    {
        private readonly IMapper _mapper;
        private readonly IDoctorRepository _doctorRepository;
        private readonly DoctorBusinessRules _doctorBusinessRules;

        public UpdateDoctorCommandHandler(
            IMapper mapper,
            IDoctorRepository doctorRepository,
            DoctorBusinessRules doctorBusinessRules)
        {
            _mapper = mapper;
            _doctorRepository = doctorRepository;
            _doctorBusinessRules = doctorBusinessRules;
        }

        public async Task<UpdatedDoctorResponse> Handle(UpdateDoctorCommand request, CancellationToken cancellationToken)
        {

            Doctor? doctor = await _doctorRepository.GetAsync(
                predicate: d => d.Id == request.Id,
                cancellationToken: cancellationToken
            );

            

            doctor = _mapper.Map(request, doctor);

            doctor.FirstName = CryptoHelper.Encrypt(doctor.FirstName);
            doctor.LastName = CryptoHelper.Encrypt(doctor.LastName);
            doctor.NationalIdentity = CryptoHelper.Encrypt(doctor.NationalIdentity);
            doctor.Phone = CryptoHelper.Encrypt(doctor.Phone);
            doctor.Address = CryptoHelper.Encrypt(doctor.Address);
            doctor.Email = CryptoHelper.Encrypt(doctor.Email);

            
            await _doctorRepository.UpdateAsync(doctor!);

            return _mapper.Map<UpdatedDoctorResponse>(doctor);
        }
    }
}
