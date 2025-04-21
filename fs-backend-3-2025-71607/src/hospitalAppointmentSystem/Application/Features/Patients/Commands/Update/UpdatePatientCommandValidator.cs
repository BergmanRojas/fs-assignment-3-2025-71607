using FluentValidation;
using System.Text.RegularExpressions;

namespace Application.Features.Patients.Commands.Update;

public class UpdatePatientCommandValidator : AbstractValidator<UpdatePatientCommand>
{
    public UpdatePatientCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty().WithMessage("Id alan� bo� olamaz");

        RuleFor(c => c.Age)
           .NotEmpty().WithMessage("Ya� alan� bo� olamaz.");

        RuleFor(c => c.Height)
            .NotEmpty().WithMessage("Boy alan� bo� olamaz.");

        RuleFor(c => c.Weight)
            .NotEmpty().WithMessage("Kilo alan� bo� olamaz.");

        RuleFor(c => c.BloodGroup)
            .NotEmpty().WithMessage("Kan grubu alan� bo� olamaz.");

        RuleFor(c => c.FirstName).NotEmpty().WithMessage("Kullan�c� ad� alan� bo� olamaz")
          .MinimumLength(2).WithMessage("Kullan�c� ad� en az 2 karakter olmal�d�r");

        RuleFor(c => c.LastName).NotEmpty().WithMessage("Kullan�c� soyad� alan� bo� olamaz")
            .MinimumLength(2).WithMessage("Kullan�c� soyad� en az 2 karakter olmal�d�r");

        RuleFor(c => c.DateOfBirth).NotEmpty().WithMessage("Do�um tarihi alan� bo� olamaz");

        RuleFor(c => c.NationalIdentity).NotEmpty().WithMessage("T.C. Kimlik numaras� alan� bo� olamaz").
            MinimumLength(11).WithMessage("T.C. Kimlik numaras� minimum 11 karakter olmal�d�r").MaximumLength(11).WithMessage("T.C. Kimlik numaras� alan� maksimum 11 karakter olmal�d�r");

        RuleFor(c => c.Email).NotEmpty().WithMessage("E-posta alan� bo� olamaz").EmailAddress().WithMessage("Girdi�iniz e-posta adresi istenen formatta de�il!");

        RuleFor(c => c.Phone).NotEmpty().WithMessage("Telefon numaras� alan� bo� olamaz").MinimumLength(11).WithMessage("Telefon numaras� minimum 11 karakter olmal�d�r");

        RuleFor(c => c.Address).NotEmpty().WithMessage("Adres alan� bo� olamaz").MinimumLength(3).WithMessage("Adres en az 3 karakter olmal�d�r");

        //RuleFor(c => c.Password).NotEmpty().WithMessage("�ifre alan� bo� olamaz").MinimumLength(8).WithMessage("�ifre en az 8 karakter olmal�")
        //    .MaximumLength(15).WithMessage("�ifre en az 15 karakter olmal�").Must(StrongPassword).WithMessage(
        //        "�ifre en az bir b�y�k harf, bir k���k harf, bir rakam ve bir �zel karakter i�ermelidir."
        //    );
    }
    private bool StrongPassword(string value)
    {
        Regex strongPasswordRegex = new("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&.*-]).{8,}$", RegexOptions.Compiled);

        return strongPasswordRegex.IsMatch(value);
    }
}
