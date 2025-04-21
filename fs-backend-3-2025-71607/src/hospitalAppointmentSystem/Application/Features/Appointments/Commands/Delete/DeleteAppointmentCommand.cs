using Application.Features.Appointments.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Pipelines.Logging;
using NArchitecture.Core.Application.Pipelines.Transaction;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Appointments.Commands.Delete;

public class DeleteAppointmentCommand : IRequest<DeletedAppointmentResponse>, ILoggableRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }
    public Guid DoctorID { get; set; }
    public Guid PatientID { get; set; }

    public string[] Roles => ["Admin", "Write", "Appointments.Delete", "Patients.Update", "Doctors.Update"];

    public bool BypassCache { get; }
    public string? CacheKey { get; }
    public string[]? CacheGroupKey => ["GetAppointments"];

    public class DeleteAppointmentCommandHandler : IRequestHandler<DeleteAppointmentCommand, DeletedAppointmentResponse>
    {
        private readonly IMapper _mapper;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly AppointmentBusinessRules _appointmentBusinessRules;

        public DeleteAppointmentCommandHandler(
            IMapper mapper,
            IAppointmentRepository appointmentRepository,
            AppointmentBusinessRules appointmentBusinessRules
        )
        {
            _mapper = mapper;
            _appointmentRepository = appointmentRepository;
            _appointmentBusinessRules = appointmentBusinessRules;
        }

        public async Task<DeletedAppointmentResponse> Handle(DeleteAppointmentCommand request, CancellationToken cancellationToken)
        {
            Appointment? appointment = await _appointmentRepository.GetAsync(
                predicate: a => a.Id == request.Id && a.DeletedDate == null,
                include: a => a.Include(a => a.Doctor)
                               .Include(a => a.Patient),
                cancellationToken: cancellationToken
            );

            await _appointmentBusinessRules.AppointmentShouldExistWhenSelected(appointment);

            await _appointmentRepository.DeleteAsync(appointment!);

            
            DeletedAppointmentResponse response = _mapper.Map<DeletedAppointmentResponse>(appointment);
            return response;
        }
    }
}
