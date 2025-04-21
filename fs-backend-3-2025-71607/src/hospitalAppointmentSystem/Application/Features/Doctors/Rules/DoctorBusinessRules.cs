using Application.Features.Doctors.Constants;
using Application.Services.Encryptions;
using Application.Services.Repositories;
using Domain.Entities;
using NArchitecture.Core.Application.Rules;
using NArchitecture.Core.CrossCuttingConcerns.Exception.Types;
using NArchitecture.Core.Localization.Abstraction;

namespace Application.Features.Doctors.Rules;

public sealed class DoctorBusinessRules : BaseBusinessRules
{
    private readonly IDoctorRepository   _doctorRepository;
    private readonly ILocalizationService _localization;

    public DoctorBusinessRules(IDoctorRepository   doctorRepository,
                               ILocalizationService localization)
    {
        _doctorRepository = doctorRepository;
        _localization     = localization;
    }

    // Helper to throw localized business exceptions
    private async Task ThrowAsync(string messageKey)
    {
        string msg = await _localization.GetLocalizedAsync(messageKey,
                                                           DoctorsBusinessMessages.SectionName);
        throw new BusinessException(msg);
    }

    /// <summary>Ensures that a National‑ID is unique (encrypted comparison).</summary>
    public async Task DoctorNationalIdentityMustBeUnique(string nationalIdentity,
                                                         CancellationToken ct)
    {
        string encrypted = CryptoHelper.Encrypt(nationalIdentity);

        bool exists = await _doctorRepository.AnyAsync(
                          d => d.NationalIdentity == encrypted,
                          cancellationToken: ct);

        if (exists)
            await ThrowAsync(DoctorsBusinessMessages.UserIdentityAlreadyExists);
    }

    /// <summary>Verifies that the doctor exists when requested by ID.</summary>
    public async Task DoctorIdMustExist(Guid id, CancellationToken ct)
    {
        Doctor? doctor = await _doctorRepository.GetAsync(
                             d => d.Id == id,
                             enableTracking: false,
                             cancellationToken: ct);

        if (doctor is null)
            await ThrowAsync(DoctorsBusinessMessages.DoctorNotExists);
    }
}