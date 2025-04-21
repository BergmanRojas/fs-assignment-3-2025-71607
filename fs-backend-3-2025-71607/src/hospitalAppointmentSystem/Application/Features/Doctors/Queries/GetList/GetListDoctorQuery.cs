using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using NArchitecture.Core.Persistence.Paging;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Application.Services.Encryptions;

namespace Application.Features.Doctors.Queries.GetList;

public class GetListDoctorQuery : IRequest<GetListResponse<GetListDoctorListItemDto>>, ICachableRequest
{
    public PageRequest PageRequest { get; set; }

    public string[] Roles => ["Admin", "Read"];

    public bool BypassCache => false;
    public string? CacheKey => $"GetListDoctors({PageRequest.PageIndex},{PageRequest.PageSize})";
    public string? CacheGroupKey => "GetDoctors";
    public TimeSpan? SlidingExpiration => TimeSpan.FromMinutes(5);

    public class GetListDoctorQueryHandler : IRequestHandler<GetListDoctorQuery, GetListResponse<GetListDoctorListItemDto>>
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMapper _mapper;

        public GetListDoctorQueryHandler(IDoctorRepository doctorRepository, IMapper mapper)
        {
            _doctorRepository = doctorRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListDoctorListItemDto>> Handle(GetListDoctorQuery request, CancellationToken cancellationToken)
        {
            IPaginate<Doctor> doctors = await _doctorRepository.GetListAsync(
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize,
                cancellationToken: cancellationToken
            );

            foreach (var doctor in doctors.Items)
            {
                doctor.FirstName = CryptoHelper.Decrypt(doctor.FirstName);
                doctor.LastName = CryptoHelper.Decrypt(doctor.LastName);
                doctor.NationalIdentity = CryptoHelper.Decrypt(doctor.NationalIdentity);
                doctor.Phone = CryptoHelper.Decrypt(doctor.Phone);
                doctor.Address = CryptoHelper.Decrypt(doctor.Address);
                doctor.Email = CryptoHelper.Decrypt(doctor.Email);
            }

            GetListResponse<GetListDoctorListItemDto> response = _mapper.Map<GetListResponse<GetListDoctorListItemDto>>(doctors);
            return response;
        }
    }
}
