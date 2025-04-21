using NArchitecture.Core.Application.Dtos;
using System;

namespace Application.Features.Reports.Queries.GetListByPatient;

public class GetListByPatientDto
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public string ReportText { get; set; }
    
    public Guid DoctorId { get; set; }
    public string DoctorFirstName { get; set; }
    public string DoctorLastName { get; set; }
    public string DoctorTitle { get; set; }

    public Guid PatientId { get; set; }
    public string PatientFirstName { get; set; }
    public string PatientLastName { get; set; }
    public string PatientIdentity { get; set; }

    public DateOnly AppointmentDate { get; set; }
    public TimeOnly AppointmentTime { get; set; }
    public DateTime ReportDate { get; set; }
}
