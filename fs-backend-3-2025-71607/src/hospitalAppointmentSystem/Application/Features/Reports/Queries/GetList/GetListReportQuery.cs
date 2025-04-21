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

namespace Application.Features.Reports.Queries.GetList;

public class GetListReportQuery : IRequest<GetListResponse<GetListReportListItemDto>>
{
    public PageRequest PageRequest { get; set; }

   

    public bool BypassCache { get; }
    public string? CacheKey => $"GetListReports({PageRequest.PageIndex},{PageRequest.PageSize})";
    public string? CacheGroupKey => "GetReports";
    public TimeSpan? SlidingExpiration { get; }

    public class GetListReportQueryHandler : IRequestHandler<GetListReportQuery, GetListResponse<GetListReportListItemDto>>
    {
        private readonly IReportRepository _reportRepository;
        private readonly IMapper _mapper;

        public GetListReportQueryHandler(IReportRepository reportRepository, IMapper mapper)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListReportListItemDto>> Handle(GetListReportQuery request, CancellationToken cancellationToken)
        {
            IPaginate<Report> reports = await _reportRepository.GetListAsync(
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize,
                cancellationToken: cancellationToken,
                include: x => x
                    .Include(x => x.Appointment)
                    .Include(x => x.Appointment.Patient)
                    .Include(x => x.Appointment.Doctor),
                predicate: x => x.DeletedDate == null
            );

            foreach (var report in reports.Items)
            {
                var doctor = report.Appointment.Doctor;
                var patient = report.Appointment.Patient;

                doctor.FirstName = CryptoHelper.Decrypt(doctor.FirstName);
                doctor.LastName = CryptoHelper.Decrypt(doctor.LastName);
                doctor.Email = CryptoHelper.Decrypt(doctor.Email);
                doctor.Phone = CryptoHelper.Decrypt(doctor.Phone);
                doctor.NationalIdentity = CryptoHelper.Decrypt(doctor.NationalIdentity);
                doctor.Address = CryptoHelper.Decrypt(doctor.Address);

                patient.FirstName = CryptoHelper.Decrypt(patient.FirstName);
                patient.LastName = CryptoHelper.Decrypt(patient.LastName);
                patient.Email = CryptoHelper.Decrypt(patient.Email);
                patient.Phone = CryptoHelper.Decrypt(patient.Phone);
                patient.NationalIdentity = CryptoHelper.Decrypt(patient.NationalIdentity);
            }

            GetListResponse<GetListReportListItemDto> response = _mapper.Map<GetListResponse<GetListReportListItemDto>>(reports);
            return response;
        }
    }
}
