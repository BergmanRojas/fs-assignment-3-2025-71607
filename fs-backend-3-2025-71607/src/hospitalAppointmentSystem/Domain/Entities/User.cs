using NArchitecture.Core.Persistence.Repositories;
using NArchitecture.Core.Security.Entities;

namespace Domain.Entities;

public class User : Entity<Guid>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? NationalIdentity { get; set; }
    public string Phone { get; set; }
    public string? Address { get; set; }
    public string Email { get; set; }
    public byte[] PasswordSalt { get; set; }
    public byte[] PasswordHash { get; set; }
    public int AuthenticatorType { get; set; }

    // Relaciones
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new HashSet<RefreshToken>();
    public virtual ICollection<OtpAuthenticator> OtpAuthenticators { get; set; } = new HashSet<OtpAuthenticator>();
    public virtual ICollection<EmailAuthenticator> EmailAuthenticators { get; set; } = new HashSet<EmailAuthenticator>();

    // Constructores
    public User() {}

    public User(Guid id, string firstName, string lastName, DateOnly? dateOfBirth, string? nationalIdentity, string phone, string? address, string email, byte[] passwordHash, byte[] passwordSalt)
    {
        Id = id;
        FirstName = firstName;
        LastName = lastName;
        DateOfBirth = dateOfBirth;
        NationalIdentity = nationalIdentity;
        Phone = phone;
        Address = address;
        Email = email;
        PasswordHash = passwordHash;
        PasswordSalt = passwordSalt;
        CreatedDate = DateTime.UtcNow;
    }
}
