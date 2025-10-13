using System.Security.Cryptography;
using System.Text;

namespace AalaNiroo.Api.Services;

public static class PasswordHasher
{
    public static string RandomHex(int bytes = 16) => Convert.ToHexString(RandomNumberGenerator.GetBytes(bytes)).ToLowerInvariant();

    public static string Hash(string password, string saltHex)
    {
        var salt = Convert.FromHexString(saltHex);
        var pwd = Encoding.UTF8.GetBytes(password);
        var combined = new byte[salt.Length + pwd.Length];
        Buffer.BlockCopy(salt, 0, combined, 0, salt.Length);
        Buffer.BlockCopy(pwd, 0, combined, salt.Length, pwd.Length);
        var hash = SHA256.HashData(combined);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
