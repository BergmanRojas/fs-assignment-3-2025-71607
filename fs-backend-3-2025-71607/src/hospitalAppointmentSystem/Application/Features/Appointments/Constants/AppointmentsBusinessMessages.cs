namespace Application.Features.Appointments.Constants;

public static class AppointmentsBusinessMessages
{
    public const string SectionName = "Appointment";

    public const string AppointmentNotExists = "B�yle bir randevu bulunmamaktad�r";

    public const string PatientCannotHaveMultipleAppointmentsOnSameDayWithSameDoctor = "Bu doktor i�in ayn� g�ne ait randevunuz zaten bulunmaktad�r.";
}
