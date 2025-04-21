using Application.Features.Notifications.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Pipelines.Logging;
using NArchitecture.Core.Application.Pipelines.Transaction;
using MediatR;

namespace Application.Features.Notifications.Commands.Delete;

public class DeleteNotificationCommand : IRequest<DeletedNotificationResponse>,  ILoggableRequest, ITransactionalRequest
{
    public int Id { get; set; }


    public bool BypassCache { get; }
    public string? CacheKey { get; }
    public string[]? CacheGroupKey => ["GetNotifications"];

    public class DeleteNotificationCommandHandler : IRequestHandler<DeleteNotificationCommand, DeletedNotificationResponse>
    {
        private readonly IMapper _mapper;
        private readonly INotificationRepository _notificationRepository;
        private readonly NotificationBusinessRules _notificationBusinessRules;

        public DeleteNotificationCommandHandler(IMapper mapper, INotificationRepository notificationRepository,
                                         NotificationBusinessRules notificationBusinessRules)
        {
            _mapper = mapper;
            _notificationRepository = notificationRepository;
            _notificationBusinessRules = notificationBusinessRules;
        }

        public async Task<DeletedNotificationResponse> Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
        {
            Notification? notification = await _notificationRepository.GetAsync(predicate: n => n.Id == request.Id && n.DeletedDate==null, cancellationToken: cancellationToken);
            await _notificationBusinessRules.NotificationShouldExistWhenSelected(notification);

            await _notificationRepository.DeleteAsync(notification!);

            DeletedNotificationResponse response = _mapper.Map<DeletedNotificationResponse>(notification);
            return response;
        }
    }
}
