using Application.Services.Repositories;
using NArchitecture.Core.Application.Rules;
using NArchitecture.Core.CrossCuttingConcerns.Exception.Types;
using NArchitecture.Core.Localization.Abstraction;
using Domain.Entities;
using Application.Services.Encryptions;
using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;
using Application.Features.Appointments.Commands.Create;
using Application.Features.Appointments.Constants;

namespace Application.Features.Appointments.Rules;

public class AppointmentBusinessRules : BaseBusinessRules
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly ILocalizationService _localizationService;

    public AppointmentBusinessRules(IAppointmentRepository appointmentRepository, ILocalizationService localizationService)
    {
        _appointmentRepository = appointmentRepository;
        _localizationService = localizationService;
    }

    private async Task ThrowBusinessException(string messageKey)
    {
        string message = await _localizationService.GetLocalizedAsync(messageKey, AppointmentsBusinessMessages.SectionName);
        throw new BusinessException(message);
    }

    public async Task AppointmentShouldExistWhenSelected(Appointment? appointment)
    {
        if (appointment == null)
            await ThrowBusinessException(AppointmentsBusinessMessages.AppointmentNotExists);
    }

    public async Task AppointmentIdShouldExistWhenSelected(int id, CancellationToken cancellationToken)
    {
        Appointment? appointment = await _appointmentRepository.GetAsync(
            predicate: a => a.Id == id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );
        await AppointmentShouldExistWhenSelected(appointment);
    }

    public async Task<Appointment> CheckForExistingDeletedAppointment(CreateAppointmentCommand request, Appointment appointment)
    {
        var existingDeletedAppointment = await _appointmentRepository.GetAsync(a =>
            a.PatientID == request.PatientID &&
            a.DoctorID == request.DoctorID &&
            a.Date == request.Date &&
            a.DeletedDate != null);

        if (existingDeletedAppointment != null)
        {
            existingDeletedAppointment.Time = request.Time;
            existingDeletedAppointment.Status = request.Status;
            existingDeletedAppointment.DeletedDate = null;
            await _appointmentRepository.UpdateAsync(existingDeletedAppointment);

            return existingDeletedAppointment;
        }
        else
        {
            await _appointmentRepository.AddAsync(appointment);
            return appointment;
        }
    }

    public async Task PatientCannotHaveMultipleAppointmentsOnSameDayWithSameDoctor(Guid patientId, Guid doctorId, DateOnly date)
    {
        bool exists = await _appointmentRepository.AnyAsync(a =>
            a.PatientID == patientId &&
            a.DoctorID == doctorId &&
            a.Date == date &&
            a.DeletedDate == null);

        if (exists)
        {
            await ThrowBusinessException(AppointmentsBusinessMessages.PatientCannotHaveMultipleAppointmentsOnSameDayWithSameDoctor);
        }
    }

    public async Task SendAppointmentConfirmationMail(Appointment appointment)
    {
        var mailMessage = new MimeMessage();
        mailMessage.From.Add(new MailboxAddress("Hospital Appointment System", "your-email@example.com"));

        appointment.Patient.Email = CryptoHelper.Decrypt(appointment.Patient.Email);
        appointment.Patient.FirstName = CryptoHelper.Decrypt(appointment.Patient.FirstName);
        appointment.Patient.LastName = CryptoHelper.Decrypt(appointment.Patient.LastName);
        appointment.Doctor.FirstName = CryptoHelper.Decrypt(appointment.Doctor.FirstName);
        appointment.Doctor.LastName = CryptoHelper.Decrypt(appointment.Doctor.LastName);

        mailMessage.To.Add(new MailboxAddress("Patient", appointment.Patient.Email));
        mailMessage.Subject = "Appointment Confirmation";

        var bodyBuilder = new BodyBuilder();
        bodyBuilder.HtmlBody = $@"
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .container {{ border: 1px solid #ccc; padding: 10px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <p>Dear {appointment.Patient.FirstName} {appointment.Patient.LastName},</p>
                    <p>You have scheduled an appointment on {appointment.Date} at {appointment.Time}.</p>
                    <p>Doctor: {appointment.Doctor.Title} {appointment.Doctor.FirstName} {appointment.Doctor.LastName}</p>
                </div>
            </body>
        </html>";

        mailMessage.Body = bodyBuilder.ToMessageBody();

        using (var smtp = new SmtpClient())
        {
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("your-email@example.com", "your-app-password");
            await smtp.SendAsync(mailMessage);
            smtp.Disconnect(true);
        }
    }

    public async Task SendAppointmentCancellationMail(Appointment appointment)
    {
        var mailMessage = new MimeMessage();
        mailMessage.From.Add(new MailboxAddress("Hospital Appointment System", "your-email@example.com"));

        appointment.Patient.Email = CryptoHelper.Decrypt(appointment.Patient.Email);
        appointment.Patient.FirstName = CryptoHelper.Decrypt(appointment.Patient.FirstName);
        appointment.Patient.LastName = CryptoHelper.Decrypt(appointment.Patient.LastName);
        appointment.Doctor.FirstName = CryptoHelper.Decrypt(appointment.Doctor.FirstName);
        appointment.Doctor.LastName = CryptoHelper.Decrypt(appointment.Doctor.LastName);

        mailMessage.To.Add(new MailboxAddress("Patient", appointment.Patient.Email));
        mailMessage.Subject = "Appointment Cancellation";

        var bodyBuilder = new BodyBuilder();
        bodyBuilder.HtmlBody = $@"
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .container {{ border: 1px solid #ccc; padding: 10px; }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <p>Dear {appointment.Patient.FirstName} {appointment.Patient.LastName},</p>
                    <p>Your appointment scheduled for {appointment.Date} at {appointment.Time} has been cancelled.</p>
                    <p>Doctor: {appointment.Doctor.Title} {appointment.Doctor.FirstName} {appointment.Doctor.LastName}</p>
                </div>
            </body>
        </html>";

        mailMessage.Body = bodyBuilder.ToMessageBody();

        using (var smtp = new SmtpClient())
        {
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("your-email@example.com", "your-app-password");
            await smtp.SendAsync(mailMessage);
            smtp.Disconnect(true);
        }
    }
}
