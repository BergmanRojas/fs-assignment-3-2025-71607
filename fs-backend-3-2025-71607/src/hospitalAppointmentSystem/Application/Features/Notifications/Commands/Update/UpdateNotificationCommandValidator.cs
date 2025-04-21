using FluentValidation;

namespace Application.Features.Notifications.Commands.Update;

public class UpdateNotificationCommandValidator : AbstractValidator<UpdateNotificationCommand>
{
    public UpdateNotificationCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty().WithMessage("Id alan� bo� olamaz");

        RuleFor(c => c.AppointmentID)
            .NotEmpty().WithMessage("Randevu ID alan� bo� olamaz.");

        RuleFor(c => c.Message)
            .NotEmpty().WithMessage("Mesaj alan� bo� olamaz.");

        RuleFor(c => c.EmailStatus)
            .NotEmpty().WithMessage("E-posta durumu alan� bo� olamaz.");

        RuleFor(c => c.SmsStatus)
            .NotEmpty().WithMessage("SMS durumu alan� bo� olamaz.");
    }
}
