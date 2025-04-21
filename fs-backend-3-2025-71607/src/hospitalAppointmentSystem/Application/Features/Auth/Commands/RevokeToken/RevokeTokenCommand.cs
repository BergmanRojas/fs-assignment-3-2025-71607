using Application.Features.Auth.Rules;
using Application.Services.AuthService;
using AutoMapper;
using MediatR;
using NArchitecture.Core.Application.Pipelines.Authorization;

namespace Application.Features.Auth.Commands.RevokeToken;

public class RevokeTokenCommand : IRequest<RevokedTokenResponse>
{
    public string Token { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;

    public string[] Roles => new[] { "Admin" };

    public RevokeTokenCommand() {}

    public RevokeTokenCommand(string token, string ipAddress)
    {
        Token = token;
        IpAddress = ipAddress;
    }

    public class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand, RevokedTokenResponse>
    {
        private readonly IAuthService _authService;
        private readonly AuthBusinessRules _authBusinessRules;
        private readonly IMapper _mapper;

        public RevokeTokenCommandHandler(IAuthService authService, AuthBusinessRules authBusinessRules, IMapper mapper)
        {
            _authService = authService;
            _authBusinessRules = authBusinessRules;
            _mapper = mapper;
        }

        public async Task<RevokedTokenResponse> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
        {
            var refreshToken = await _authService.GetRefreshTokenByToken(request.Token);
            await _authBusinessRules.RefreshTokenShouldBeExists(refreshToken);
            await _authBusinessRules.RefreshTokenShouldBeActive(refreshToken!);

            await _authService.RevokeRefreshToken(refreshToken!, request.IpAddress, "Revoked without replacement");

            return _mapper.Map<RevokedTokenResponse>(refreshToken);
        }
    }
}
