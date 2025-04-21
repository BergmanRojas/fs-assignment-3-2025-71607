using FluentValidation;
using System.Text.RegularExpressions;

namespace Application.Features.Doctors.Commands.Create;

public class CreateDoctorCommandValidator : AbstractValidator<CreateDoctorCommand>
{
    public CreateDoctorCommandValidator()
    {
        RuleFor(c => c.Title)
            .NotEmpty().WithMessage("Title field cannot be empty")
            .Length(2, 10).WithMessage("Title must be between 2 and 10 characters long.");

        RuleFor(c => c.SchoolName)
            .NotEmpty().WithMessage("School name cannot be empty")
            .Length(3, 50).WithMessage("School name must be between 3 and 50 characters long.");

        RuleFor(c => c.FirstName)
            .NotEmpty().WithMessage("First name cannot be empty")
            .MinimumLength(2).WithMessage("First name must be at least 2 characters long.");

        RuleFor(c => c.LastName)
            .NotEmpty().WithMessage("Last name cannot be empty")
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters long.");

        RuleFor(c => c.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth cannot be empty");

        RuleFor(c => c.NationalIdentity)
            .NotEmpty().WithMessage("National identity number cannot be empty")
            .Length(11).WithMessage("National identity number must be exactly 11 characters long");

        RuleFor(c => c.Email)
            .NotEmpty().WithMessage("Email cannot be empty")
            .EmailAddress().WithMessage("The email format is invalid");

        RuleFor(c => c.Phone)
            .NotEmpty().WithMessage("Phone number cannot be empty")
            .MinimumLength(11).WithMessage("Phone number must be at least 11 characters long");

        RuleFor(c => c.Address)
            .NotEmpty().WithMessage("Address cannot be empty")
            .MinimumLength(3).WithMessage("Address must be at least 3 characters long");

        RuleFor(c => c.Password)
            .NotEmpty().WithMessage("Password cannot be empty")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
            .MaximumLength(15).WithMessage("Password must be at most 15 characters long")
            .Must(StrongPassword).WithMessage("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
    }

    private bool StrongPassword(string value)
    {
        Regex strongPasswordRegex = new("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&.*-]).{8,}$", RegexOptions.Compiled);
        return strongPasswordRegex.IsMatch(value);
    }
}
