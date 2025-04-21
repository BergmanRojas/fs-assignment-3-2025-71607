using FluentValidation;
using System.Text.RegularExpressions;

namespace Application.Features.Doctors.Commands.Update;

public class UpdateDoctorCommandValidator : AbstractValidator<UpdateDoctorCommand>
{
    public UpdateDoctorCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty().WithMessage("ID field cannot be empty");

        RuleFor(c => c.Title)
            .NotEmpty().WithMessage("Title field cannot be empty")
            .Length(2, 10).WithMessage("Title must be between 2 and 10 characters");

        RuleFor(c => c.SchoolName)
             .NotEmpty().WithMessage("School name cannot be empty")
             .Length(3, 50).WithMessage("School name must be between 3 and 50 characters");

        RuleFor(c => c.FirstName).NotEmpty().WithMessage("First name field cannot be empty")
           .MinimumLength(2).WithMessage("First name must be at least 2 characters long");

        RuleFor(c => c.LastName).NotEmpty().WithMessage("Last name field cannot be empty")
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters long");

        RuleFor(c => c.DateOfBirth).NotEmpty().WithMessage("Date of birth field cannot be empty");

        RuleFor(c => c.NationalIdentity).NotEmpty().WithMessage("National identity number field cannot be empty")
            .Length(11).WithMessage("National identity number must be exactly 11 characters long");

        RuleFor(c => c.Email).NotEmpty().WithMessage("Email field cannot be empty")
            .EmailAddress().WithMessage("The email address you entered is not in the correct format");

        RuleFor(c => c.Phone).NotEmpty().WithMessage("Phone number field cannot be empty")
            .MinimumLength(11).WithMessage("Phone number must be at least 11 characters long");

        RuleFor(c => c.Address).NotEmpty().WithMessage("Address field cannot be empty")
            .MinimumLength(3).WithMessage("Address must be at least 3 characters long");
    }

    private bool StrongPassword(string value)
    {
        Regex strongPasswordRegex = new("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&.*-]).{8,}$", RegexOptions.Compiled);
        return strongPasswordRegex.IsMatch(value);
    }
}
