using Application.Features.Doctors.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Pipelines.Authorization;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Services.Encryptions;

namespace Application.Features.Doctors.Queries.GetById;

public class GetByIdDoctorQuery : IRequest<GetByIdDoctorResponse>
{
    public Guid Id { get; set; }

    public string[] Roles => ["Admin", "Read", "Doctors.Update"];

    public class GetByIdDoctorQueryHandler : IRequestHandler<GetByIdDoctorQuery, GetByIdDoctorResponse>
    {
        private readonly IMapper _mapper;
        private readonly IDoctorRepository _doctorRepository;
        private readonly DoctorBusinessRules _doctorBusinessRules;

        public GetByIdDoctorQueryHandler(IMapper mapper, IDoctorRepository doctorRepository, DoctorBusinessRules doctorBusinessRules)
        {
            _mapper = mapper;
            _doctorRepository = doctorRepository;
            _doctorBusinessRules = doctorBusinessRules;
        }

        public async Task<GetByIdDoctorResponse> Handle(GetByIdDoctorQuery request, CancellationToken cancellationToken)
        {
            Doctor? doctor = await _doctorRepository.GetAsync(
                predicate: d => d.Id == request.Id,
                cancellationToken: cancellationToken
            );

            

            doctor.FirstName = CryptoHelper.Decrypt(doctor.FirstName);
            doctor.LastName = CryptoHelper.Decrypt(doctor.LastName);
            doctor.NationalIdentity = CryptoHelper.Decrypt(doctor.NationalIdentity);
            doctor.Phone = CryptoHelper.Decrypt(doctor.Phone);
            doctor.Address = CryptoHelper.Decrypt(doctor.Address);
            doctor.Email = CryptoHelper.Decrypt(doctor.Email);

            GetByIdDoctorResponse response = _mapper.Map<GetByIdDoctorResponse>(doctor);
            return response;
        }
    }
}
