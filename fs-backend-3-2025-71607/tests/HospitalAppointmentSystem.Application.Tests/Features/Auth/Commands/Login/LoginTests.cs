using Moq;
using Application.Features.Auth.Commands.Login;
using Application.Features.Auth.Profiles;
using Application.Features.Auth.Rules;
using Application.Features.Users.Rules;
using Application.Services.AuthenticatorService;
using Application.Services.AuthService;
using Application.Services.Repositories;
using Application.Services.UsersService;
using AutoMapper;
using FluentValidation.TestHelper;
using Microsoft.Extensions.Configuration;
using NArchitecture.Core.CrossCuttingConcerns.Exception.Types;
using NArchitecture.Core.Localization.Abstraction;
using NArchitecture.Core.Localization.Resource.Yaml;
using NArchitecture.Core.Mailing;
using NArchitecture.Core.Mailing.MailKit;
using NArchitecture.Core.Security.EmailAuthenticator;
using NArchitecture.Core.Security.JWT;
using NArchitecture.Core.Security.OtpAuthenticator;
using NArchitecture.Core.Security.OtpAuthenticator.OtpNet;
using StarterProject.Application.Tests.Mocks.Configurations;
using StarterProject.Application.Tests.Mocks.FakeDatas;
using StarterProject.Application.Tests.Mocks.Repositories.Auth;
using static Application.Features.Auth.Commands.Login.LoginCommand;

namespace StarterProject.Application.Tests.Features.Auth.Commands.Login;

public class LoginTests
{
    private readonly LoginCommandHandler _handler;
    private readonly LoginCommandValidator _validator;
    private readonly IConfiguration _configuration;

    public LoginTests()
    {
        // ---------- configuración fake ----------
        _configuration           = MockConfiguration.GetConfigurationMock();
        var userFakeData         = new UserFakeData();
        var refreshTokenFakeData = new RefreshTokenFakeData();

        // ---------- repositorios ----------
        IRefreshTokenRepository refreshTokenRepository =
            new MockRefreshTokenRepository(refreshTokenFakeData).GetMockRefreshTokenRepository();
        IUserRepository userRepository =
            new MockUserRepository(userFakeData).GetUserMockRepository();

        // ---------- helpers / servicios ----------
        var tokenOptions = _configuration.GetSection("TokenOptions").Get<TokenOptions>()!;
        ITokenHelper<Guid,int,Guid> tokenHelper = new JwtHelper<Guid,int,Guid>(tokenOptions);

        MailSettings mailSettings = _configuration.GetSection("MailSettings").Get<MailSettings>()!;
        IMailService mailService  = new MailKitMailService(mailSettings);

        IEmailAuthenticatorHelper emailAuthHelper = new EmailAuthenticatorHelper();
        IOtpAuthenticatorHelper   otpHelper       = new OtpNetOtpAuthenticatorHelper();

        IEmailAuthenticatorRepository emailAuthRepo = MockEmailAuthenticatorRepository.GetEmailAuthenticatorRepositoryMock();
        IOtpAuthenticatorRepository   otpAuthRepo   = MockOtpAuthRepository.GetOtpAuthenticatorMock();

        ILocalizationService localizationService = new ResourceLocalizationManager(resources: [])
        {
            AcceptLocales = new[] { "en" }
        };

        IMapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile<MappingProfiles>()));

        // ---------- mocks extra que exige AuthBusinessRules ----------
        var patientRepoMock      = new Mock<IPatientRepository>().Object;
        var authenticatorSvcMock = new Mock<IAuthenticatorService>().Object;

        // ---------- reglas / servicios de dominio ----------
        var authService = new AuthManager(refreshTokenRepository, tokenHelper, _configuration, mapper);

        var userRules   = new UserBusinessRules(userRepository, localizationService);
        var userService = new UserManager(userRepository, userRules);

        var authRules = new AuthBusinessRules(
                            userRepository,
                            localizationService,
                            patientRepoMock,
                            authenticatorSvcMock);

        var authenticatorSvc = new AuthenticatorManager(
                                    emailAuthHelper, emailAuthRepo,
                                    mailService,     otpHelper,   otpAuthRepo);

        // ---------- handler & validator ----------
        _handler   = new LoginCommandHandler(userService, authService, authRules, authenticatorSvc);
        _validator = new LoginCommandValidator();
    }

    // -------------- TESTS -----------------

    [Fact]
    public async Task SuccessfulLoginShouldReturnAccessToken()
    {
        var cmd = new LoginCommand
        {
            UserForLoginDto = new() { Email = "example@kodlama.io", Password = "123456" }
        };

        LoggedResponse result = await _handler.Handle(cmd, CancellationToken.None);
        Assert.False(string.IsNullOrWhiteSpace(result.AccessToken.Token));
    }

    [Fact]
    public async Task LoginWithWrongPasswordShouldThrowException()
    {
        var cmd = new LoginCommand
        {
            UserForLoginDto = new() { Email = "example@kodlama.io", Password = "wrong‑pwd" }
        };

        await Assert.ThrowsAsync<BusinessException>(() => _handler.Handle(cmd, CancellationToken.None));
    }

    [Fact]
    public void ValidatorShouldCatchShortPasswords()
    {
        var cmd = new LoginCommand
        {
            UserForLoginDto = new() { Email = "example@kodlama.io", Password = "1" }
        };

        _validator.TestValidate(cmd)
                  .ShouldHaveValidationErrorFor(c => c.UserForLoginDto.Password);
    }
}