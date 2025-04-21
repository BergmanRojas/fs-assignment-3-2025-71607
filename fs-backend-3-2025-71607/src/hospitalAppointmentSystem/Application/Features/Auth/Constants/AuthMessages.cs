namespace Application.Features.Auth.Constants;

public static class AuthMessages
{
    public const string SectionName = "Auth";

    public const string EmailAuthenticatorDontExists = "B�yle bir e-posta do�rulay�c� yok";
    public const string OtpAuthenticatorDontExists = "B�yle bir OTP do�rulay�c� yok";
    public const string AlreadyVerifiedOtpAuthenticatorIsExists = "Bu OTP do�rulay�c� zaten do�ruland�";
    public const string EmailActivationKeyDontExists = "B�yle bir e-posta aktivasyon anahtar� yok";
    public const string UserDontExists = "B�yle bir kullan�c� bulunmamaktad�r";
    public const string UserHaveAlreadyAAuthenticator = "Kullan�c�n�n zaten bir do�rulay�c�s� var";
    public const string RefreshDontExists = "B�yle bir yenileme yok";
    public const string InvalidRefreshToken = "Ge�ersiz yenileme belirteci";
    public const string UserMailAlreadyExists = "B�yle bir mail adresi zaten var";
    public const string InvalidIdentity = "Ge�ersiz TC kimlik numaras� veya kimlik bilgileri";
    public const string PasswordDontMatch = "�ifreler e�le�miyor";
    public static string EmailActivationKeyExpired = "Aktivasyon kodunun s�resi 15 dakikad�r. L�tfen tekrar �ye olun!";
    public static string EmailActivationDontExist = "E-posta do�rulamas� yap�lmam��. L�tfen e-posta hesab�n�z� do�rulay�n";
}
