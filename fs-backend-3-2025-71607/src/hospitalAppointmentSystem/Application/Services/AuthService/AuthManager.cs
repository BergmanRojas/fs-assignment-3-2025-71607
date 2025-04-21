using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using NArchitecture.Core.Security.Entities;
using NArchitecture.Core.Security.Enums;
using NArchitecture.Core.Security.JWT;

namespace Application.Services.AuthService;

public class AuthManager : IAuthService
{
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly ITokenHelper<Guid, int, Guid> _tokenHelper;
    private readonly TokenOptions _tokenOptions;
    private readonly IMapper _mapper;

    public AuthManager(
        IRefreshTokenRepository refreshTokenRepository,
        ITokenHelper<Guid, int, Guid> tokenHelper,
        IConfiguration configuration,
        IMapper mapper
    )
    {
        _refreshTokenRepository = refreshTokenRepository;
        _tokenHelper = tokenHelper;
        _tokenOptions = configuration.GetSection("TokenOptions").Get<TokenOptions>()
                         ?? throw new NullReferenceException("TokenOptions section not found");
        _mapper = mapper;
    }

    private NArchitecture.Core.Security.Entities.User<Guid> MapToBaseUser(User user)
    {
        return new NArchitecture.Core.Security.Entities.User<Guid>
        {
            Id = user.Id,
            Email = user.Email,
            PasswordHash = user.PasswordHash,
            PasswordSalt = user.PasswordSalt,
            AuthenticatorType = (AuthenticatorType)user.AuthenticatorType
        };
    }

    public Task<AccessToken> CreateAccessToken(User user)
    {
        var baseUser = MapToBaseUser(user);
        var accessToken = _tokenHelper.CreateToken(baseUser, null);
        return Task.FromResult(accessToken);
    }

    public async Task<RefreshToken> AddRefreshToken(RefreshToken refreshToken)
    {
        return await _refreshTokenRepository.AddAsync(refreshToken);
    }

    public async Task DeleteOldRefreshTokens(Guid userId)
    {
        var refreshTokens = await _refreshTokenRepository.GetOldRefreshTokensAsync(userId, _tokenOptions.RefreshTokenTTL);
        await _refreshTokenRepository.DeleteRangeAsync(refreshTokens);
    }

    public Task RevokeDescendantRefreshTokens(RefreshToken refreshToken, string ipAddress, string reason)
    {
        throw new NotImplementedException();
    }

    public async Task<RefreshToken?> GetRefreshTokenByToken(string token)
    {
        return await _refreshTokenRepository.GetAsync(r => r.Token == token);
    }

    public async Task RevokeRefreshToken(RefreshToken refreshToken, string ipAddress, string? reason = null, string? replacedByToken = null)
    {
        refreshToken.RevokedDate = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        refreshToken.ReasonRevoked = reason;
        refreshToken.ReplacedByToken = replacedByToken;
        await _refreshTokenRepository.UpdateAsync(refreshToken);
    }

    public Task<RefreshToken> CreateRefreshToken(User user, string ipAddress)
    {
        var baseUser = MapToBaseUser(user);
        var coreRefreshToken = _tokenHelper.CreateRefreshToken(baseUser, ipAddress);
        var refreshToken = _mapper.Map<RefreshToken>(coreRefreshToken);
        return Task.FromResult(refreshToken);
    }

    public async Task<RefreshToken> RotateRefreshToken(User user, RefreshToken refreshToken, string ipAddress)
    {
        var baseUser = MapToBaseUser(user);
        var newCoreRefreshToken = _tokenHelper.CreateRefreshToken(baseUser, ipAddress);
        var newRefreshToken = _mapper.Map<RefreshToken>(newCoreRefreshToken);

        await RevokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);

        return newRefreshToken;
    }
}
