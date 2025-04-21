using Application.Features.Appointments.Rules;
using Application.Services.Doctors;
using Application.Services.Patients;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;
using NArchitecture.Core.Application.Pipelines.Authorization;


namespace Application.Features.Appointments.Commands.Create
{
    public class CreateAppointmentCommand : IRequest<CreatedAppointmentResponse>
    {
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public bool Status { get; set; }
        public Guid DoctorID { get; set; }
        public Guid PatientID { get; set; }



        public bool BypassCache { get; }
        public string? CacheKey { get; }
        public string[]? CacheGroupKey => ["GetAppointments"];


        public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, CreatedAppointmentResponse>
        {
            private readonly IMapper _mapper;
            private readonly IAppointmentRepository _appointmentRepository;
            private readonly IDoctorService _doctorService;
            private readonly IPatientService _patientService;
            
            private readonly AppointmentBusinessRules _appointmentBusinessRules;

            public CreateAppointmentCommandHandler(IMapper mapper, IAppointmentRepository appointmentRepository, IDoctorService doctorService, IPatientService patientService, AppointmentBusinessRules appointmentBusinessRules)
            {
                _mapper = mapper;
                _appointmentRepository = appointmentRepository;
                _doctorService = doctorService;
                _patientService = patientService;
               
                _appointmentBusinessRules = appointmentBusinessRules;
            }

            public async Task<CreatedAppointmentResponse> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
            {

                // Yeni randevu olu�tur
                Appointment appointment = _mapper.Map<Appointment>(request);

                
                Doctor doctor = await _doctorService.GetAsync(d => d.Id == request.DoctorID);
                appointment.Doctor = doctor;


                
                Patient patient = await _patientService.GetAsync(p => p.Id == request.PatientID);
                appointment.Patient = patient;



                


                
                await _appointmentBusinessRules.PatientCannotHaveMultipleAppointmentsOnSameDayWithSameDoctor(request.PatientID, request.DoctorID, request.Date);



                  
                    Appointment result = await _appointmentBusinessRules.CheckForExistingDeletedAppointment(request,appointment);


                    await _appointmentBusinessRules.SendAppointmentConfirmationMail(result);
                    CreatedAppointmentResponse response = _mapper.Map<CreatedAppointmentResponse>(result);
                    return response;
               
                }
            }

        
        }
    }
