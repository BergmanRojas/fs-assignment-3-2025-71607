using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using NArchitecture.Core.Persistence.Paging;
using Microsoft.EntityFrameworkCore;
using Application.Services.Encryptions;

namespace Application.Features.Reports.Queries.GetListByPatient;

public class GetListByPatientQuery : IRequest<GetListResponse<GetListByPatientDto>>
{
    public PageRequest PageRequest { get; set; }
    public Guid PatientId { get; set; }


    public bool BypassCache { get; }
    public string? CacheKey => $"GetListReports({PageRequest.PageIndex},{PageRequest.PageSize})";
    public string? CacheGroupKey => "GetReports";
    public TimeSpan? SlidingExpiration { get; }

    public class GetListByPatientQueryHandler : IRequestHandler<GetListByPatientQuery, GetListResponse<GetListByPatientDto>>
    {
        private readonly IReportRepository _reportRepository;
        private readonly IMapper _mapper;

        public GetListByPatientQueryHandler(IReportRepository reportRepository, IMapper mapper)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListByPatientDto>> Handle(
            GetListByPatientQuery request,
            CancellationToken cancellationToken
        )
        {
            IPaginate<Report> reports = await _reportRepository.GetListAsync(
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize,
                cancellationToken: cancellationToken,
                orderBy: x => x.OrderByDescending(y => y.CreatedDate),
                include: x => x
                    .Include(x => x.Appointment)
                    .Include(x => x.Appointment.Doctor)
                    .Include(x => x.Appointment.Patient),
                predicate: x => x.Appointment.PatientID == request.PatientId && x.DeletedDate == null
            );

            foreach (var report in reports.Items)
            {
                var doctor = report.Appointment.Doctor;
                var patient = report.Appointment.Patient;

                // Decrypt patient info
                patient.FirstName = CryptoHelper.Decrypt(patient.FirstName);
                patient.LastName = CryptoHelper.Decrypt(patient.LastName);
                patient.NationalIdentity = CryptoHelper.Decrypt(patient.NationalIdentity);
                patient.Email = CryptoHelper.Decrypt(patient.Email);
                patient.Phone = CryptoHelper.Decrypt(patient.Phone);

                // Decrypt doctor info
                doctor.FirstName = CryptoHelper.Decrypt(doctor.FirstName);
                doctor.LastName = CryptoHelper.Decrypt(doctor.LastName);
                doctor.Address = CryptoHelper.Decrypt(doctor.Address);
                doctor.Email = CryptoHelper.Decrypt(doctor.Email);
                doctor.NationalIdentity = CryptoHelper.Decrypt(doctor.NationalIdentity);
                doctor.Phone = CryptoHelper.Decrypt(doctor.Phone);
            }

            GetListResponse<GetListByPatientDto> response = _mapper.Map<GetListResponse<GetListByPatientDto>>(reports);
            return response;
        }
    }
}
