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

namespace Application.Features.Appointments.Queries.GetByPatientId;

public class GetListByPatientQuery : IRequest<GetListResponse<GetListByPatientDto>>
{
    public PageRequest PageRequest { get; set; }
    public Guid PatientId { get; set; }

    public string[] Roles => ["Admin", "Read", "Patients.Update"];

    public bool BypassCache => false;
    public string? CacheKey => $"GetListAppointments({PageRequest.PageIndex},{PageRequest.PageSize})";
    public string? CacheGroupKey => "GetAppointments";
    public TimeSpan? SlidingExpiration => TimeSpan.FromMinutes(5);

    public class GetListByPatientQueryHandler : IRequestHandler<GetListByPatientQuery, GetListResponse<GetListByPatientDto>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public GetListByPatientQueryHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListByPatientDto>> Handle(GetListByPatientQuery request, CancellationToken cancellationToken)
        {
            IPaginate<Appointment> appointments = await _appointmentRepository.GetListAsync(
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize,
                cancellationToken: cancellationToken,
                orderBy: x => x.OrderByDescending(y => y.Date),
                include: x => x.Include(x => x.Doctor).Include(x => x.Patient),
                predicate: x => x.PatientID == request.PatientId && x.DeletedDate == null
            );

            foreach (var appointment in appointments.Items)
            {
                appointment.Doctor.FirstName = CryptoHelper.Decrypt(appointment.Doctor.FirstName);
                appointment.Doctor.LastName = CryptoHelper.Decrypt(appointment.Doctor.LastName);
                appointment.Patient.FirstName = CryptoHelper.Decrypt(appointment.Patient.FirstName);
                appointment.Patient.LastName = CryptoHelper.Decrypt(appointment.Patient.LastName);
            }

            GetListResponse<GetListByPatientDto> response = _mapper.Map<GetListResponse<GetListByPatientDto>>(appointments);
            return response;
        }
    }
}
