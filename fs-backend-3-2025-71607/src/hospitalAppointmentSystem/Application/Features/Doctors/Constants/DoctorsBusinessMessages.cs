namespace Application.Features.Doctors.Constants;

public static class DoctorsBusinessMessages
{
    public const string SectionName = "Doctor";

    public const string DoctorNotExists                     = "The requested doctor could not be found.";
    public const string DoctorNationalIdentityAlreadyExists = "A doctor with the same national identity already exists.";   // NEW
    public const string UserIdentityAlreadyExists           = "A user with the same national identity already exists.";
    public const string HasFutureAppointments               = "The doctor cannot be deleted because there are future appointments scheduled.";
    public const string InvalidIdentity                     = "Invalid national identity or related personal information.";
}