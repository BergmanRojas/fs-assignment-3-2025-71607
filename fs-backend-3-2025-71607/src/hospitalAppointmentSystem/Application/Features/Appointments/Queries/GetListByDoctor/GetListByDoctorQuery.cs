using Application.Features.Appointments.Queries.GetListByDoctor;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using NArchitecture.Core.Persistence.Paging;
using Microsoft.EntityFrameworkCore;
using Application.Services.Encryptions;

namespace Application.Features.Appointments.Queries.GetListByDoctorId;

public class GetListByDoctorQuery : IRequest<GetListResponse<GetListByDoctorDto>>
{
    public PageRequest PageRequest { get; set; }
    public Guid DoctorId { get; set; }



    public bool BypassCache { get; }
    public string? CacheKey => $"GetListAppointments({PageRequest.PageIndex},{PageRequest.PageSize})";
    public string? CacheGroupKey => "GetAppointments";
    public TimeSpan? SlidingExpiration { get; }

    public class GetListByDoctorQueryHandler : IRequestHandler<GetListByDoctorQuery, GetListResponse<GetListByDoctorDto>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public GetListByDoctorQueryHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListByDoctorDto>> Handle(
            GetListByDoctorQuery request,
            CancellationToken cancellationToken
        )
        {
            IPaginate<Appointment> appointments = await _appointmentRepository.GetListAsync(
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize,
                cancellationToken: cancellationToken,
                orderBy: x => x.OrderByDescending(y => y.Date),
                include: x => x
                    .Include(x => x.Doctor)
                    .Include(x => x.Patient),
                predicate: x => x.DoctorID == request.DoctorId && x.DeletedDate == null
            );

            foreach (var appointment in appointments.Items)
            {
                var patient = appointment.Patient;
                patient.FirstName = CryptoHelper.Decrypt(patient.FirstName);
                patient.LastName = CryptoHelper.Decrypt(patient.LastName);
                patient.NationalIdentity = CryptoHelper.Decrypt(patient.NationalIdentity);
                patient.Phone = CryptoHelper.Decrypt(patient.Phone);
                patient.Address = CryptoHelper.Decrypt(patient.Address);
                patient.Email = CryptoHelper.Decrypt(patient.Email);
            }

            GetListResponse<GetListByDoctorDto> response = _mapper.Map<GetListResponse<GetListByDoctorDto>>(appointments);
            return response;
        }
    }
}
