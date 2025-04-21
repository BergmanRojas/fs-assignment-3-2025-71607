using Bogus;
using Domain.Entities;
using Application.Services.Patients;
using Application.Services.Encryptions;

namespace Application.Services.FakeData;

public class FakePatientSeeder
{
    private readonly IPatientService _patientService;

    public FakePatientSeeder(IPatientService patientService)
    {
        _patientService = patientService;
    }

    public async Task SeedFakePatientsAsync(int count = 1000)
    {
        var faker = new Faker("en");

        var fakePatients = new List<Patient>();

        for (int i = 0; i < count; i++)
        {
            string firstName = faker.Name.FirstName();
            string lastName = faker.Name.LastName();
            string phone = faker.Phone.PhoneNumber("05#########");
            string email = faker.Internet.Email(firstName, lastName);
            string address = faker.Address.FullAddress();
            string identity = faker.Random.ReplaceNumbers("###########");
            DateOnly dob = DateOnly.FromDateTime(faker.Date.Past(60, DateTime.Today.AddYears(-20)));
            double height = faker.Random.Double(150, 200);
            double weight = faker.Random.Double(50, 120);

            var patient = new Patient
            {
                FirstName = CryptoHelper.Encrypt(firstName),
                LastName = CryptoHelper.Encrypt(lastName),
                Phone = CryptoHelper.Encrypt(phone),
                Email = CryptoHelper.Encrypt(email),
                Address = CryptoHelper.Encrypt(address),
                NationalIdentity = CryptoHelper.Encrypt(identity),
                DateOfBirth = dob,
                Height = height,
                Weight = weight
            };

            HashPassword("123456", out byte[] hash, out byte[] salt);
            patient.PasswordHash = hash;
            patient.PasswordSalt = salt;

            fakePatients.Add(patient);
        }

        foreach (var patient in fakePatients)
        {
            await _patientService.AddAsync(patient);
        }
    }

    private void HashPassword(string password, out byte[] hash, out byte[] salt)
    {
        NArchitecture.Core.Security.Hashing.HashingHelper.CreatePasswordHash(password, out hash, out salt);
    }
}

