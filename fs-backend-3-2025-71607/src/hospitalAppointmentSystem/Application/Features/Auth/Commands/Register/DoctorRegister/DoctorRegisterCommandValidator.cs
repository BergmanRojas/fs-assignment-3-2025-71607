using Application.Features.Auth.Commands.Register.PatientRegister;
using FluentValidation;
using System.Text.RegularExpressions;

namespace Application.Features.Auth.Commands.Register.DoctorRegister;

public class DoctorRegisterCommandValidator : AbstractValidator<DoctorRegisterCommand>
{
    public DoctorRegisterCommandValidator()
    {
        RuleFor(c => c.DoctorForRegisterDto.Email)
            .NotEmpty().WithMessage("Email cannot be empty.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(c => c.DoctorForRegisterDto.Title)
            .NotEmpty().WithMessage("Title cannot be empty.")
            .Length(2, 10).WithMessage("Title must be between 2 and 10 characters.");

        RuleFor(c => c.DoctorForRegisterDto.SchoolName)
            .NotEmpty().WithMessage("School name cannot be empty.")
            .Length(3, 50).WithMessage("School name must be between 3 and 50 characters.");

        RuleFor(c => c.DoctorForRegisterDto.FirstName)
            .NotEmpty().WithMessage("First name cannot be empty.")
            .MinimumLength(2).WithMessage("First name must be at least 2 characters.");

        RuleFor(c => c.DoctorForRegisterDto.LastName)
            .NotEmpty().WithMessage("Last name cannot be empty.")
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters.");

        RuleFor(c => c.DoctorForRegisterDto.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth cannot be empty.");

        RuleFor(c => c.DoctorForRegisterDto.NationalIdentity)
            .NotEmpty().WithMessage("National identity number cannot be empty.")
            .Length(11).WithMessage("National identity number must be 11 characters.");

        RuleFor(c => c.DoctorForRegisterDto.Phone)
            .NotEmpty().WithMessage("Phone number cannot be empty.")
            .MinimumLength(11).WithMessage("Phone number must be at least 11 characters.");

        RuleFor(c => c.DoctorForRegisterDto.Address)
            .NotEmpty().WithMessage("Address cannot be empty.")
            .MinimumLength(3).WithMessage("Address must be at least 3 characters.");

        RuleFor(c => c.DoctorForRegisterDto.Password)
            .NotEmpty().WithMessage("Password cannot be empty.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            .MaximumLength(15).WithMessage("Password must not exceed 15 characters.")
            .Must(StrongPassword).WithMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
    }

    private bool StrongPassword(string value)
    {
        Regex strongPasswordRegex = new("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", RegexOptions.Compiled);
        return strongPasswordRegex.IsMatch(value);
    }
}
