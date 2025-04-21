using FluentValidation;

namespace Application.Features.Appointments.Commands.Update;

public class UpdateAppointmentCommandValidator : AbstractValidator<UpdateAppointmentCommand>
{
    public UpdateAppointmentCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty().WithMessage("Id alan� bo� b�rak�lamaz.");
        RuleFor(c => c.Date).NotEmpty().WithMessage("Tarih alan� bo� b�rak�lamaz.");
        RuleFor(c => c.Time).NotEmpty().WithMessage("Saat alan� bo� b�rak�lamaz.");
        RuleFor(c => c.Status).NotEmpty().WithMessage("Durum alan� bo� b�rak�lamaz.");
        RuleFor(c => c.DoctorID).NotEmpty().WithMessage("Doktor Id alan� bo� b�rak�lamaz.");
        RuleFor(c => c.PatientID).NotEmpty().WithMessage("Hasta Id alan� bo� b�rak�lamaz.");

    }
}
