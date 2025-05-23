using Application.Features.Reports.Commands.Create;
using Application.Features.Reports.Commands.Delete;
using Application.Features.Reports.Commands.Update;
using Application.Features.Reports.Queries.GetByAppointmentId;
using Application.Features.Reports.Queries.GetById;
using Application.Features.Reports.Queries.GetList;
using Application.Features.Reports.Queries.GetListByDoctor;
using Application.Features.Reports.Queries.GetListByPatient;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Responses;
using NArchitecture.Core.Persistence.Paging;

namespace Application.Features.Reports.Profiles;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateReportCommand, Report>();
        CreateMap<Report, CreatedReportResponse>();

        CreateMap<UpdateReportCommand, Report>();
        CreateMap<Report, UpdatedReportResponse>();

        CreateMap<DeleteReportCommand, Report>();
        CreateMap<Report, DeletedReportResponse>();

        CreateMap<Report, GetByIdReportResponse>()
            .ForMember(x => x.DoctorFirstName, opt => opt.MapFrom(dto => dto.Appointment.Doctor.FirstName))
            .ForMember(x => x.DoctorLastName, opt => opt.MapFrom(dto => dto.Appointment.Doctor.LastName))
            .ForMember(x => x.DoctorID, opt => opt.MapFrom(dto => dto.Appointment.Doctor.Id))
            .ForMember(x => x.DoctorTitle, opt => opt.MapFrom(dto => dto.Appointment.Doctor.Title))
            .ForMember(x => x.PatientFirstName, opt => opt.MapFrom(dto => dto.Appointment.Patient.FirstName))
            .ForMember(x => x.PatientLastName, opt => opt.MapFrom(dto => dto.Appointment.Patient.LastName))
            .ForMember(x => x.AppointmentDate, opt => opt.MapFrom(dto => dto.Appointment.Date))
            .ForMember(x => x.AppointmentTime, opt => opt.MapFrom(dto => dto.Appointment.Time))
            .ForMember(x => x.ReportDate, opt => opt.MapFrom(dto => dto.CreatedDate))
            .ForMember(x => x.PatientIdentity, opt => opt.MapFrom(dto => dto.Appointment.Patient.NationalIdentity))
            .ForMember(x => x.PatientID, opt => opt.MapFrom(dto => dto.Appointment.Patient.Id));

        CreateMap<Report, GetListReportListItemDto>()
            .ForMember(x => x.DoctorFirstName, opt => opt.MapFrom(dto => dto.Appointment.Doctor.FirstName))
            .ForMember(x => x.DoctorLastName, opt => opt.MapFrom(dto => dto.Appointment.Doctor.LastName))
            .ForMember(x => x.DoctorId, opt => opt.MapFrom(dto => dto.Appointment.Doctor.Id)) // CORREGIDO
            .ForMember(x => x.DoctorTitle, opt => opt.MapFrom(dto => dto.Appointment.Doctor.Title))
            .ForMember(x => x.PatientId, opt => opt.MapFrom(dto => dto.Appointment.Patient.Id)) // CORREGIDO
            .ForMember(x => x.PatientIdentity, opt => opt.MapFrom(dto => dto.Appointment.Patient.NationalIdentity))
            .ForMember(x => x.PatientFirstName, opt => opt.MapFrom(dto => dto.Appointment.Patient.FirstName))
            .ForMember(x => x.PatientLastName, opt => opt.MapFrom(dto => dto.Appointment.Patient.LastName))
            .ForMember(x => x.AppointmentDate, opt => opt.MapFrom(dto => dto.Appointment.Date))
            .ForMember(x => x.AppointmentTime, opt => opt.MapFrom(dto => dto.Appointment.Time))
            .ForMember(x => x.ReportDate, opt => opt.MapFrom(dto => dto.CreatedDate))
            .ForMember(x => x.ReportText, opt => opt.MapFrom(dto => dto.Text)); // opcional si quieres mapear el texto
        CreateMap<IPaginate<Report>, GetListResponse<GetListReportListItemDto>>();

        CreateMap<Report, GetListByDoctorDto>()
            .ForMember(x => x.DoctorFirstName, opt => opt.MapFrom(dto => dto.Appointment.Doctor.FirstName))
            .ForMember(x => x.DoctorLastName, opt => opt.MapFrom(dto => dto.Appointment.Doctor.LastName))
            .ForMember(x => x.DoctorID, opt => opt.MapFrom(dto => dto.Appointment.Doctor.Id))
            .ForMember(x => x.DoctorTitle, opt => opt.MapFrom(dto => dto.Appointment.Doctor.Title))
            .ForMember(x => x.PatientFirstName, opt => opt.MapFrom(dto => dto.Appointment.Patient.FirstName))
            .ForMember(x => x.PatientLastName, opt => opt.MapFrom(dto => dto.Appointment.Patient.LastName))
            .ForMember(x => x.AppointmentDate, opt => opt.MapFrom(dto => dto.Appointment.Date))
            .ForMember(x => x.AppointmentTime, opt => opt.MapFrom(dto => dto.Appointment.Time))
            .ForMember(x => x.ReportDate, opt => opt.MapFrom(dto => dto.CreatedDate))
            .ForMember(x => x.PatientIdentity, opt => opt.MapFrom(dto => dto.Appointment.Patient.NationalIdentity))
            .ForMember(x => x.PatientID, opt => opt.MapFrom(dto => dto.Appointment.Patient.Id));

        CreateMap<IPaginate<Report>, GetListResponse<GetListByDoctorDto>>();

        CreateMap<Report, GetListByPatientDto>()
            .ForMember(x => x.DoctorFirstName, opt => opt.MapFrom(dto => dto.Appointment.Doctor.FirstName))
            .ForMember(x => x.DoctorLastName, opt => opt.MapFrom(dto => dto.Appointment.Doctor.LastName))
            .ForMember(x => x.DoctorId, opt => opt.MapFrom(dto => dto.Appointment.Doctor.Id)) // CORREGIDO
            .ForMember(x => x.DoctorTitle, opt => opt.MapFrom(dto => dto.Appointment.Doctor.Title))
            .ForMember(x => x.PatientId, opt => opt.MapFrom(dto => dto.Appointment.Patient.Id)) // CORREGIDO
            .ForMember(x => x.PatientIdentity, opt => opt.MapFrom(dto => dto.Appointment.Patient.NationalIdentity))
            .ForMember(x => x.PatientFirstName, opt => opt.MapFrom(dto => dto.Appointment.Patient.FirstName))
            .ForMember(x => x.PatientLastName, opt => opt.MapFrom(dto => dto.Appointment.Patient.LastName))
            .ForMember(x => x.AppointmentDate, opt => opt.MapFrom(dto => dto.Appointment.Date))
            .ForMember(x => x.AppointmentTime, opt => opt.MapFrom(dto => dto.Appointment.Time))
            .ForMember(x => x.ReportDate, opt => opt.MapFrom(dto => dto.CreatedDate))
            .ForMember(x => x.ReportText, opt => opt.MapFrom(dto => dto.Text)); // opcional si quieres mapear el texto
        CreateMap<IPaginate<Report>, GetListResponse<GetListByPatientDto>>();

        CreateMap<Report, GetByAppointmentIdResponse>()
            .ForMember(x => x.Id, opt => opt.MapFrom(dto => dto.Id))
            .ForMember(x => x.AppointmentID, opt => opt.MapFrom(dto => dto.AppointmentID))
            .ForMember(x => x.Text, opt => opt.MapFrom(dto => dto.Text));
    }
}
