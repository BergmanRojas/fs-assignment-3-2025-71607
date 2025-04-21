using Application.Features.Doctors.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Pipelines.Logging;
using NArchitecture.Core.Application.Pipelines.Transaction;
using MediatR;
using Application.Services.Appointments;

namespace Application.Features.Doctors.Commands.Delete;

public class DeleteDoctorCommand : IRequest<DeletedDoctorResponse>, ILoggableRequest, ITransactionalRequest
{
    public Guid Id { get; set; }

    public string[] Roles => new[] { "Admin", "Write" };

    public bool BypassCache => false;
    public string? CacheKey => null;
    public string[]? CacheGroupKey => new[] { "GetDoctors" };

    public class DeleteDoctorCommandHandler : IRequestHandler<DeleteDoctorCommand, DeletedDoctorResponse>
    {
        private readonly IMapper _mapper;
        private readonly IDoctorRepository _doctorRepository;
        private readonly DoctorBusinessRules _doctorBusinessRules;
        private readonly IAppointmentService _appointmentService;

        public DeleteDoctorCommandHandler(
            IMapper mapper,
            IDoctorRepository doctorRepository,
            DoctorBusinessRules doctorBusinessRules,
            IAppointmentService appointmentService)
        {
            _mapper = mapper;
            _doctorRepository = doctorRepository;
            _doctorBusinessRules = doctorBusinessRules;
            _appointmentService = appointmentService;
        }

        public async Task<DeletedDoctorResponse> Handle(DeleteDoctorCommand request, CancellationToken cancellationToken)
        {
            var doctor = await _doctorRepository.GetAsync(
                predicate: d => d.Id == request.Id && d.DeletedDate == null,
                cancellationToken: cancellationToken,
                withDeleted: true
            );

            

            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Today);
            

            doctor!.DeletedDate = DateTime.Now;
            await _doctorRepository.UpdateAsync(doctor);

            return _mapper.Map<DeletedDoctorResponse>(doctor);
        }
    }
}
