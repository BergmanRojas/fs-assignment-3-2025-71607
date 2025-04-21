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

namespace Application.Features.Appointments.Queries.GetList;

public class GetListAppointmentQuery : IRequest<GetListResponse<GetListAppointmentListItemDto>>
{
    public PageRequest PageRequest { get; set; }
 

    public bool BypassCache { get; }
    public string? CacheKey => $"GetListAppointments({PageRequest.PageIndex},{PageRequest.PageSize})";
    public string? CacheGroupKey => "GetAppointments";
    public TimeSpan? SlidingExpiration { get; }

    public class GetListAppointmentQueryHandler : IRequestHandler<GetListAppointmentQuery, GetListResponse<GetListAppointmentListItemDto>>
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public GetListAppointmentQueryHandler(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListAppointmentListItemDto>> Handle(GetListAppointmentQuery request, CancellationToken cancellationToken)
        {
            IPaginate<Appointment> appointments = await _appointmentRepository.GetListAsync(
                predicate: x => x.DeletedDate == null,
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize,
                cancellationToken: cancellationToken,
                orderBy: x => x.OrderByDescending(y => y.Date),
                include: x => x.Include(x => x.Doctor).Include(x => x.Patient)
            );

            foreach (var item in appointments.Items)
            {
                item.Patient.FirstName = CryptoHelper.Decrypt(item.Patient.FirstName);
                item.Patient.LastName = CryptoHelper.Decrypt(item.Patient.LastName);
                item.Patient.NationalIdentity = CryptoHelper.Decrypt(item.Patient.NationalIdentity);
                item.Patient.Phone = CryptoHelper.Decrypt(item.Patient.Phone);
                item.Patient.Address = CryptoHelper.Decrypt(item.Patient.Address);
                item.Patient.Email = CryptoHelper.Decrypt(item.Patient.Email);

                item.Doctor.FirstName = CryptoHelper.Decrypt(item.Doctor.FirstName);
                item.Doctor.LastName = CryptoHelper.Decrypt(item.Doctor.LastName);
                item.Doctor.NationalIdentity = CryptoHelper.Decrypt(item.Doctor.NationalIdentity);
                item.Doctor.Phone = CryptoHelper.Decrypt(item.Doctor.Phone);
                item.Doctor.Address = CryptoHelper.Decrypt(item.Doctor.Address);
            }

            GetListResponse<GetListAppointmentListItemDto> response = _mapper.Map<GetListResponse<GetListAppointmentListItemDto>>(appointments);
            return response;
        }
    }
}
